'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-api-transport-authority-inventory.js');
const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, API_TRANSPORT_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'api-transport-authority-'));
  for (const relativePath of [
    'config/api-transport-authority-inventory.json',
    'app/soapbox/api.ts',
    'app/soapbox/utils/auth.ts',
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

const assertRunFails = (root, pattern) => {
  assert.throws(() => run(root), error => pattern.test(`${error.stderr || ''}\n${error.message || ''}`));
};

test('verifies the bounded current API transport authority inventory', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedSurfaces, 2);
  assert.deepEqual(report.surfaceIds, ['central-axios-client', 'auth-origin-token-selection']);
  assert.equal(report.explicitUnknowns, 5);
});

test('fails when bearer attachment drifts without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/api.ts', source => source.replace("'Authorization': `Bearer ${accessToken}`", "'X-Token': accessToken"));
  assertRunFails(root, /central-axios-client/);
});

test('fails when a required surface is removed from the manifest', () => {
  const root = fixture();
  mutate(root, 'config/api-transport-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.surfaces = manifest.surfaces.filter(surface => surface.id !== 'auth-origin-token-selection');
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /required API transport surface auth-origin-token-selection is missing/);
});

test('fails when the broad URL selector is reclassified', () => {
  const root = fixture();
  mutate(root, 'config/api-transport-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.surfaces.find(surface => surface.id === 'auth-origin-token-selection').classification = 'validated-safe-url-selector';
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /classification changed/);
});

test('fails when shared timeout behavior changes without inventory reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/api.ts', source => source.replace('return axios.create({', 'return axios.create({\n    timeout: 10000,'));
  assertRunFails(root, /changed the bounded safety-control boundary/);
});

test('fails when explicit unknowns silently shrink', () => {
  const root = fixture();
  mutate(root, 'config/api-transport-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.explicitUnknowns.pop();
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /explicitUnknowns changed|required explicit unknown/);
});

test('rejects source paths escaping the repository root', () => {
  const root = fixture();
  mutate(root, 'config/api-transport-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.surfaces[0].path = '../outside.ts';
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /path changed|unsafe source path/);
});
