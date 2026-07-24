'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.SENTRY_AUTHORITY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'sentry-authority-inventory.json');
const packagePath = path.join(root, 'package.json');
const lockfilePath = path.join(root, 'yarn.lock');
const fail = message => { throw new Error(`sentry-authority: ${message}`); };

const expectedDependencies = new Map([
  ['@sentry/browser', '^7.2.0'],
  ['@sentry/react', '^7.2.0'],
  ['@sentry/tracing', '^7.2.0'],
]);
const expectedLockfileResolutions = new Map([
  ['@sentry/browser', {
    selector: '@sentry/browser@npm:^7.2.0',
    version: '7.120.4',
    resolution: '@sentry/browser@npm:7.120.4',
    checksum: '11cf09f94847f230698d3218c73d09e372a9ffefa039203d6c6bf64c7b8ac38c6452a760f40b2df798562a625031bf0ac92eb87c3380df4e8164a3da0aaaf216',
  }],
  ['@sentry/react', {
    selector: '@sentry/react@npm:^7.2.0',
    version: '7.120.4',
    resolution: '@sentry/react@npm:7.120.4',
    checksum: 'fdb84a475ebe016cda5df49cd01d51ef648eff1df6557a141f214c712f90dca6cc4dbe3fe33ff3152aeec61db39734a66d215f3664c726c3dd9b1dc3e6a6800c',
  }],
  ['@sentry/tracing', {
    selector: '@sentry/tracing@npm:^7.2.0',
    version: '7.120.4',
    resolution: '@sentry/tracing@npm:7.120.4',
    checksum: 'd2a85d896acb229ca40ace559b65087f9b0a41f7596b5a015c4ac4533d4344410d858b1723c0eebffb0d6acdf01be558dfb4d85258652d3e1cdac8c207612319',
  }],
]);
const expectedUnknowns = [
  'Repository-wide Sentry initialization and capture call-site enumeration remains incomplete.',
  'Consent, opt-out, sampling, retention and environment policy are not verified.',
  'Event, breadcrumb, request, account and credential redaction behavior is not proven.',
  'Source-map publication, release naming and build-artifact secret exposure remain unverified.',
];
const expectedInvariants = [
  'dependencyPresenceDoesNotProveRuntimeInitialization',
  'dsnExposureDoesNotProveConsentOrRedaction',
  'productionTelemetryRequiresFailClosedRedaction',
  'runtimeActivationRemainsBlockedUntilVerified',
  'trackedLockfileControlsInstalledSentryCode',
];

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const lockfile = fs.readFileSync(lockfilePath, 'utf8');
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);

for (const [name, version] of expectedDependencies) {
  if (manifest.dependencies?.[name] !== version) fail(`manifest dependency ${name} changed without checker reconciliation`);
  if (packageJson.dependencies?.[name] !== version) fail(`package dependency ${name} changed without inventory reconciliation`);
}
if (Object.keys(manifest.dependencies || {}).length !== expectedDependencies.size) fail('manifest dependency set changed without checker reconciliation');

const lockfileBlockFor = selector => {
  const lines = lockfile.split('\n');
  const start = lines.findIndex(line => line.startsWith('"') && line.endsWith(':') && line.includes(selector));
  if (start < 0) fail(`lockfile selector ${selector} is missing`);
  let end = start + 1;
  while (end < lines.length && !lines[end].startsWith('"')) end += 1;
  return lines.slice(start, end).join('\n');
};

for (const [name, expected] of expectedLockfileResolutions) {
  const manifestEntry = manifest.lockfileResolutions?.[name];
  if (!manifestEntry) fail(`manifest lockfile resolution ${name} is missing`);
  for (const field of ['selector', 'version', 'resolution', 'checksum']) {
    if (manifestEntry[field] !== expected[field]) fail(`manifest lockfile ${name} ${field} changed without checker reconciliation`);
  }
  const block = lockfileBlockFor(expected.selector);
  const expectedFields = [
    `  version: ${expected.version}`,
    `  resolution: "${expected.resolution}"`,
    `  checksum: ${expected.checksum}`,
  ];
  for (const field of expectedFields) {
    if (!block.includes(field)) fail(`lockfile resolution for ${name} changed: missing ${field}`);
  }
}
if (Object.keys(manifest.lockfileResolutions || {}).length !== expectedLockfileResolutions.size) fail('manifest lockfile resolution set changed without checker reconciliation');

const config = manifest.configurationSurface;
if (!config || config.path !== 'app/soapbox/build_config.js' || config.environmentKey !== 'SENTRY_DSN') fail('Sentry configuration surface changed without checker reconciliation');
const absolute = path.resolve(root, config.path);
const relative = path.relative(root, absolute);
if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe configuration path ${config.path}`);
const source = fs.readFileSync(absolute, 'utf8');
for (const fragment of [
  'SENTRY_DSN,\n} = process.env;',
  'SENTRY_DSN,\n});',
]) {
  if (!source.includes(fragment)) fail(`${config.path} no longer contains Sentry configuration evidence: ${fragment}`);
}

if (!Array.isArray(manifest.explicitUnknowns) || manifest.explicitUnknowns.length !== expectedUnknowns.length) fail('explicitUnknowns changed without reconciliation');
if (new Set(manifest.explicitUnknowns).size !== expectedUnknowns.length) fail('explicitUnknowns must remain unique');
for (const unknown of expectedUnknowns) {
  if (!manifest.explicitUnknowns.includes(unknown)) fail(`required explicit unknown is missing: ${unknown}`);
}
for (const invariant of expectedInvariants) {
  if (manifest.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedDependencies: expectedDependencies.size,
  checkedLockfileResolutions: expectedLockfileResolutions.size,
  configurationKey: config.environmentKey,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
