'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.SENTRY_AUTHORITY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'sentry-authority-inventory.json');
const packagePath = path.join(root, 'package.json');
const fail = message => { throw new Error(`sentry-authority: ${message}`); };

const expectedDependencies = new Map([
  ['@sentry/browser', '^7.2.0'],
  ['@sentry/react', '^7.2.0'],
  ['@sentry/tracing', '^7.2.0'],
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
];

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);

for (const [name, version] of expectedDependencies) {
  if (manifest.dependencies?.[name] !== version) fail(`manifest dependency ${name} changed without checker reconciliation`);
  if (packageJson.dependencies?.[name] !== version) fail(`package dependency ${name} changed without inventory reconciliation`);
}
if (Object.keys(manifest.dependencies || {}).length !== expectedDependencies.size) fail('manifest dependency set changed without checker reconciliation');

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
  configurationKey: config.environmentKey,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
