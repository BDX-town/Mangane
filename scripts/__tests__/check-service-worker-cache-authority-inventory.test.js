'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-service-worker-cache-authority-inventory.js');
const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, SERVICE_WORKER_CACHE_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'service-worker-cache-authority-'));
  for (const relativePath of [
    'config/service-worker-cache-authority-inventory.json',
    'webpack/production.js',
    'app/soapbox/service_worker/entry.ts',
    'app/soapbox/persistence/cache-storage.ts',
    'docs/architecture/SERVICE_WORKER_CACHE_AUTHORITY_DRIFT_GATE.md',
  ]) {
    const destination = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(repositoryRoot, relativePath), destination);
  }
  return root;
};
const mutate = (root, relativePath, transform) => {
  const target = path.join(root, relativePath);
  fs.writeFileSync(target, transform(fs.readFileSync(target, 'utf8')));
};
const assertRunFails = (root, pattern) => assert.throws(() => run(root), error => pattern.test(`${error.stderr || ''}\n${error.message || ''}`));

test('verifies the bounded production service-worker cache authority inventory', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedCacheName, 'soapbox');
  assert.equal(report.checkedBackendRoutePrefixes, 23);
  assert.equal(report.checkedEntryImports, 2);
  assert.equal(report.explicitUnknowns, 5);
});

test('fails when the global cache name changes without reconciliation', () => {
  const root = fixture();
  mutate(root, 'webpack/production.js', source => source.replace('cacheName: \'soapbox\'', 'cacheName: \'mangane-v2\''));
  assertRunFails(root, /cacheName|'soapbox'/);
});

test('fails when an API navigation prefix is removed', () => {
  const root = fixture();
  mutate(root, 'webpack/production.js', source => source.replace('            \'/api\',\n', ''));
  assertRunFails(root, /'\/api'/);
});

test('fails when navigation matching is broadened beyond navigate requests', () => {
  const root = fixture();
  mutate(root, 'webpack/production.js', source => source.replace('requestTypes: [\'navigate\']', 'requestTypes: [\'navigate\', \'fetch\']'));
  assertRunFails(root, /requestTypes/);
});

test('fails when the app shell stops respecting FE_SUBDIRECTORY', () => {
  const root = fixture();
  mutate(root, 'webpack/production.js', source => source.replace('appShell: join(FE_SUBDIRECTORY, \'/\')', 'appShell: \'/\''));
  assertRunFails(root, /appShell/);
});

test('fails when the production worker drops the push handler import', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/entry.ts', source => source.replace('import \'./web_push_notifications\';\n', ''));
  assertRunFails(root, /web_push_notifications/);
});

test('fails when optional cache safety changes without reconciliation', () => {
  const root = fixture();
  mutate(root, 'webpack/production.js', source => source.replace('safeToUseOptionalCaches: true', 'safeToUseOptionalCaches: false'));
  assertRunFails(root, /safeToUseOptionalCaches/);
});

test('fails when a cache-safety unknown is silently removed', () => {
  const root = fixture();
  mutate(root, 'config/service-worker-cache-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.explicitUnknowns.pop();
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /explicit unknown/);
});

test('does not allow comments to satisfy executable production evidence', () => {
  const root = fixture();
  mutate(root, 'webpack/production.js', source => source.replace('cacheName: \'soapbox\',', 'cacheName: \'changed\', // cacheName: \'soapbox\','));
  assertRunFails(root, /cacheName|'soapbox'/);
});

test('rejects an unsafe manifest source path', () => {
  const root = fixture();
  mutate(root, 'config/service-worker-cache-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.productionConfig.path = '../outside.js';
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /production service-worker configuration path|unsafe/);
});
