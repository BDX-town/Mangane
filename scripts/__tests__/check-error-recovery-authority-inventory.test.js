'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '../..');
const checker = path.join(repoRoot, 'scripts/check-error-recovery-authority-inventory.js');
const boundedFiles = [
  'config/error-recovery-authority-inventory.json',
  'app/soapbox/components/error_boundary.tsx',
  'app/soapbox/storage/kv_store.ts',
  'app/soapbox/containers/soapbox.tsx',
];

const makeFixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'error-recovery-authority-'));
  for (const relative of boundedFiles) {
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(repoRoot, relative), destination);
  }
  return root;
};

const runChecker = root => spawnSync(process.execPath, [checker], {
  cwd: repoRoot,
  env: { ...process.env, ERROR_RECOVERY_INVENTORY_ROOT: root },
  encoding: 'utf8',
});

const mutate = (root, relative, transform) => {
  const file = path.join(root, relative);
  fs.writeFileSync(file, transform(fs.readFileSync(file, 'utf8')));
};

test('verifies the bounded production evidence', t => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const result = runChecker(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Error recovery authority inventory verified/);
});

test('rejects required evidence retained only in a line comment', t => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  mutate(root, 'app/soapbox/components/error_boundary.tsx', source => source.replace('localStorage.clear();', '// localStorage.clear();'));
  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /localStorage/);
});

test('rejects incomplete emergency purge drift', t => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  mutate(root, 'app/soapbox/components/error_boundary.tsx', source => source.replace('sessionStorage.clear();', ''));
  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /sessionStorage/);
});

test('rejects recovery manifest drift', t => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  mutate(root, 'config/error-recovery-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.recovery.navigation = "location.href = '/app'";
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /recovery changed/);
});

test('rejects silently removed blockers', t => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  mutate(root, 'config/error-recovery-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.unknowns.shift();
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknowns changed/);
});

test('rejects removal of the mounted root error boundary', t => {
  const root = makeFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  mutate(root, 'app/soapbox/containers/soapbox.tsx', source => source.replace('<ErrorBoundary>', '<>'));
  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /root provider/);
});
