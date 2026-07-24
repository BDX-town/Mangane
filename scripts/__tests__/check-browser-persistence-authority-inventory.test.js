'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
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
    'app/soapbox/storage/kv_store.ts',
    'app/soapbox/service_worker/web_push_notifications.ts',
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

test('verifies the bounded current persistence inventory', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedSurfaces, 7);
  assert.equal(report.sensitiveSurfaces, 7);
  assert.equal(report.explicitUnknowns, 4);
});

test('fails when credential persistence drifts without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/reducers/auth.js', source => source.replace('localStorage.setItem(STORAGE_KEY, JSON.stringify(state.toJS()))', 'void state'));
  assertRunFails(root, /auth-local-storage/);
});

test('fails when any baseline persistence surface is silently removed', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces = manifest.surfaces.filter(surface => surface.id !== 'auth-account-snapshot');
    return manifest;
  });
  assertRunFails(root, /required baseline surface auth-account-snapshot/);
});

test('fails when a legacy credential copy is silently removed from the inventory', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces = manifest.surfaces.filter(surface => surface.id !== 'legacy-auth-user');
    return manifest;
  });
  assertRunFails(root, /required baseline surface legacy-auth-user/);
});

test('fails when a Phase 0 unknown is silently removed', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.explicitUnknowns = manifest.explicitUnknowns.slice(0, 1);
    return manifest;
  });
  assertRunFails(root, /required explicit unknown is missing/);
});

test('fails when notification action credentials drift without review', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace('data.access_token).then', "'redacted').then"));
  assertRunFails(root, /native-notification-data/);
});

test('rejects source paths escaping the repository root', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces[0].path = '../outside.js';
    return manifest;
  });
  assertRunFails(root, /unsafe source path/);
});
