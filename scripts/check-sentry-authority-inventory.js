'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { buildTelemetryManifest } = require('./telemetry-inventory-lib');

const root = path.resolve(process.env.SENTRY_AUTHORITY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const manifest = JSON.parse(read('config/sentry-authority-inventory.json'));
assert.deepStrictEqual(manifest, buildTelemetryManifest(root), 'Telemetry authority manifest drifted; regenerate and reconcile it');

const packageJson = JSON.parse(read('package.json'));
assert.deepStrictEqual(Object.keys(packageJson.dependencies || {}).filter(name => name.startsWith('@sentry/')), [], 'Sentry dependencies must remain removed');
assert.ok(!read('yarn.lock').includes('@sentry/'), 'Sentry transitive code must remain absent from the lockfile');
assert.ok(!read('app/soapbox/build_config.js').includes('SENTRY_DSN'), 'The public Sentry DSN build input must remain removed');
assert.equal(manifest.callsites.filter(item => item.kind === 'telemetry-capture').length, 0, 'No telemetry capture callsite is permitted');
assert.equal(manifest.callsites.filter(item => item.kind === 'secret-candidate').length, 0, 'No high-confidence secret candidate is permitted in source, fixtures, tests, workflows, or tooling');
assert.equal(manifest.callsites.filter(item => item.kind === 'console' && item.path.includes('/service_worker/')).length, 0, 'Service workers must not log because window startup does not govern worker consoles');

const application = read('app/application.ts');
assert.ok(application.includes('installDiagnosticConsolePolicy();'), 'Application startup must install diagnostic protection');
assert.ok(application.indexOf('installDiagnosticConsolePolicy();') < application.indexOf('loadPolyfills()'), 'Diagnostic protection must install before asynchronous startup');

const diagnostics = read(manifest.diagnostics.module);
for (const evidence of [
  'Object.getOwnPropertyDescriptors(value)',
  'const enabled = process.env.NODE_ENV === \'development\'',
  'values.map(redactDiagnosticValue)',
  ': () => undefined',
  'new WeakSet()',
]) assert.ok(diagnostics.includes(evidence), `Diagnostic redaction evidence missing: ${evidence}`);

assert.ok(read('webpack/production.js').includes('devtool: false'), 'Production source maps must remain disabled');
assert.ok(read('webpack/production.js').includes('clean: true'), 'Production output must be cleaned so stale source maps cannot survive');
assert.ok(read('webpack/development.js').includes('devtool: \'source-map\''), 'Development source maps must remain explicitly non-production');
assert.ok(read('app/soapbox/store.ts').includes('devTools: BuildConfig.NODE_ENV !== \'production\''), 'Production Redux DevTools must remain disabled');
const artifactWorkflow = read('.github/workflows/architecture-inventory.yml');
assert.equal(manifest.callsites.filter(item => item.kind === 'artifact-upload').length, 1, 'Only the classified architecture inventory artifact may be uploaded');
assert.ok(artifactWorkflow.includes('path: architecture-inventory/'), 'Artifact upload must remain limited to generated architecture evidence');
assert.ok(artifactWorkflow.includes('retention-days: 30'), 'Architecture evidence retention must remain bounded to 30 days');

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  callsites: manifest.callsites.length,
  counts: manifest.counts,
  productionTelemetry: manifest.telemetry.productionEnabled,
  productionSourceMaps: manifest.buildArtifacts.productionSourceMaps,
}, null, 2)}\n`);
