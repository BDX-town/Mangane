'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-browser-persistence-authority-inventory.js');
const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, BROWSER_PERSISTENCE_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'browser-persistence-authority-'));
  for (const relativePath of [
    'config/browser-persistence-authority-inventory.json',
    'app/soapbox/reducers/auth.js',
    'app/soapbox/api.ts',
    'app/soapbox/persistence/auth-storage.ts',
    'app/soapbox/persistence/cache-storage.ts',
    'app/soapbox/persistence/cross-tab.ts',
    'app/soapbox/persistence/emergency-reset.ts',
    'app/soapbox/persistence/lifecycle.ts',
    'app/soapbox/persistence/object-urls.ts',
    'app/soapbox/persistence/purge.ts',
    'app/soapbox/service_worker/web_push_notifications.ts',
    'app/soapbox/stream.ts',
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

const mutateManifest = (root, transform) => mutate(
  root,
  'config/browser-persistence-authority-inventory.json',
  source => `${JSON.stringify(transform(JSON.parse(source)), null, 2)}\n`,
);

const assertRunFails = (root, pattern) => {
  assert.throws(() => run(root), error => {
    const output = `${error.stderr || ''}\n${error.message || ''}`;
    return pattern.test(output);
  });
};

test('verifies the completed Phase 0C persistence authority', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedSurfaces, 12);
  assert.equal(report.sensitiveSurfaces, 8);
  assert.equal(report.documentedConstraints, 4);
});

test('fails when credential persistence drifts without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/reducers/auth.js', source => source.replace('writeStoredJSON(localStorage, STORAGE_KEY, state.toJS())', 'void state'));
  assertRunFails(root, /auth-local-storage/);
});

test('fails when any baseline persistence surface is silently removed', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces = manifest.surfaces.filter(surface => surface.id !== 'indexeddb-account-snapshot');
    return manifest;
  });
  assertRunFails(root, /required Phase 0C surface indexeddb-account-snapshot/);
});

test('fails when cross-tab purge authority is silently removed from the inventory', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces = manifest.surfaces.filter(surface => surface.id !== 'cross-tab-purge');
    return manifest;
  });
  assertRunFails(root, /required Phase 0C surface cross-tab-purge/);
});

test('fails when a Phase 0C invariant is silently disabled', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.invariants.lateResponsesAndWritesAreGenerationFenced = false;
    return manifest;
  });
  assertRunFails(root, /lateResponsesAndWritesAreGenerationFenced/);
});

test('fails when durable worker revocation drifts without review', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace(
    `const REVOCATION_CACHE = 'soapbox-private-revocations-v1';`,
    `const REVOCATION_CACHE = 'removed';`,
  ));
  assertRunFails(root, /durable-worker-revocation/);
});

test('rejects source paths escaping the repository root', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces[0].path = '../outside.js';
    return manifest;
  });
  assertRunFails(root, /unsafe source path/);
});
