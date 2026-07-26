'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.BUILD_BASELINE_ROOT || path.resolve(__dirname, '..'));
const outputRoot = path.resolve(process.env.BUILD_OUTPUT_ROOT || path.join(root, 'static'));
const configPath = path.join(root, 'config', 'build-budget.json');
const fail = message => {
  throw new Error(`build-baseline: ${message}`);
};
const resolveOutput = relativePath => {
  const absolute = path.resolve(outputRoot, relativePath.replace(/^\/+/, ''));
  const relative = path.relative(outputRoot, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe output path ${relativePath}`);
  return absolute;
};
const fileSize = relativePath => {
  const absolute = resolveOutput(relativePath);
  if (!fs.existsSync(absolute)) fail(`missing generated asset ${relativePath}`);
  return fs.statSync(absolute).size;
};
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (config.schemaVersion !== 1) fail(`unsupported schemaVersion ${config.schemaVersion}`);
if (!config.owner) fail('budget owner is required');

const manifestPath = path.join(outputRoot, 'assets-manifest.json');
if (!fs.existsSync(manifestPath)) fail('assets-manifest.json is missing; run the production build first');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const assets = manifest.entrypoints?.application?.assets;
if (!assets || assets.js?.length !== 2 || assets.css?.length !== 1) {
  fail('application entrypoint shape changed without budget reconciliation');
}
if (manifest.__offline_serviceworker !== '/__offline_serviceworker') {
  fail('production service-worker manifest entry is missing or changed');
}

const [runtimeJavaScript, applicationJavaScript] = assets.js;
const [applicationCss] = assets.css;
const serviceWorker = '/sw.js';
const observed = {
  applicationCssBytes: fileSize(applicationCss),
  applicationJavaScriptBytes: fileSize(applicationJavaScript),
  runtimeJavaScriptBytes: fileSize(runtimeJavaScript),
  serviceWorkerBytes: fileSize(serviceWorker),
};

for (const [metric, size] of Object.entries(observed)) {
  const budget = config.production[metric];
  if (!Number.isInteger(budget) || budget <= 0) fail(`invalid ${metric} budget`);
  if (size > budget) fail(`${metric} is ${size} bytes, over the ${budget}-byte budget`);
}

const files = walk(outputRoot);
if (config.production.forbidSourceMaps && files.some(file => file.endsWith('.map'))) {
  fail('production output contains source maps');
}

const secretPatterns = config.secretPatterns.map(item => ({
  id: item.id,
  regex: new RegExp(item.pattern, 'g'),
}));
for (const file of files) {
  if (!/\.(?:css|html|js|json|txt)$/i.test(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  for (const secret of secretPatterns) {
    secret.regex.lastIndex = 0;
    if (secret.regex.test(source)) fail(`${secret.id} pattern found in ${path.relative(outputRoot, file)}`);
  }
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: config.schemaVersion,
  owner: config.owner,
  observed,
  scannedFiles: files.length,
  secretPatterns: secretPatterns.length,
}, null, 2)}\n`);
