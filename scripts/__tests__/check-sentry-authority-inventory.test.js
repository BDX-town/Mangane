'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const checker = path.join(repositoryRoot, 'scripts', 'check-sentry-authority-inventory.js');
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'telemetry-authority-'));
  for (const relative of ['app', 'webpack', 'scripts', '.github', 'config/sentry-authority-inventory.json', 'package.json', 'yarn.lock']) {
    fs.cpSync(path.join(repositoryRoot, relative), path.join(root, relative), { recursive: true });
  }
  return root;
};
const run = root => spawnSync(process.execPath, [checker], {
  cwd: repositoryRoot,
  env: { ...process.env, SENTRY_AUTHORITY_INVENTORY_ROOT: root },
  encoding: 'utf8',
});
const mutate = (root, relative, transform) => {
  const target = path.join(root, relative);
  fs.writeFileSync(target, transform(fs.readFileSync(target, 'utf8')));
};
const fails = (root, pattern) => {
  const result = run(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}\n${result.stdout}`, pattern);
};

test('verifies the complete Phase 0E telemetry authority', () => {
  const result = run(repositoryRoot);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).productionTelemetry, false);
});

test('fails when a logging callsite is added without reconciliation', () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, 'app/soapbox/new-log.ts'), 'console.error(\'new\');\n');
  fails(root, /manifest drifted/);
});

test('fails when telemetry code or a provider returns', () => {
  const root = fixture();
  mutate(root, 'package.json', source => {
    const packageJson = JSON.parse(source);
    packageJson.dependencies['@sentry/browser'] = '7.120.4';
    return `${JSON.stringify(packageJson, null, 2)}\n`;
  });
  fails(root, /manifest drifted|Sentry dependencies/);
});

test('fails when a high-confidence secret is added to a fixture', () => {
  const root = fixture();
  const fakeToken = `ghp_${'abcdefghijklmnopqrstuvwxyz1234567890'}`;
  fs.writeFileSync(path.join(root, 'app/soapbox/__fixtures__/leak.ts'), `export const token = '${fakeToken}';\n`);
  fails(root, /manifest drifted|secret candidate/);
});

test('fails when startup redaction is removed', () => {
  const root = fixture();
  mutate(root, 'app/application.ts', source => source.replace('installDiagnosticConsolePolicy();', ''));
  fails(root, /install diagnostic protection/);
});

test('fails when production source maps return', () => {
  const root = fixture();
  mutate(root, 'webpack/production.js', source => source.replace('devtool: false', 'devtool: \'source-map\''));
  fails(root, /manifest drifted|source maps/);
});

test('fails when stale production artifacts are no longer cleaned', () => {
  const root = fixture();
  mutate(root, 'webpack/production.js', source => source.replace('clean: true', 'clean: false'));
  fails(root, /output must be cleaned/);
});

test('fails when production Redux DevTools are enabled', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/store.ts', source => source.replace('BuildConfig.NODE_ENV !== \'production\'', 'true'));
  fails(root, /manifest drifted|Redux DevTools/);
});
