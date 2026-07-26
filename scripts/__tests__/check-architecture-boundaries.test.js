'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-architecture-boundaries.js');

const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, ARCHITECTURE_BOUNDARY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'architecture-boundary-'));
  for (const relativePath of [
    'config/architecture-boundary-inventory.json',
    'app/soapbox/components',
  ]) {
    const source = path.join(repositoryRoot, relativePath);
    const destination = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(source, destination, { recursive: true });
  }
  return root;
};

test('accepts the reconciled presentation boundary inventory', () => {
  assert.equal(JSON.parse(run()).schemaVersion, 1);
});

test('rejects a new direct API dependency in presentation code', () => {
  const root = fixture();
  const target = path.join(root, 'app/soapbox/components/adversarial.tsx');
  fs.writeFileSync(target, 'import api from \'soapbox/api\';\nexport default api;\n');
  assert.throws(() => run(root), /presentation dependency drift/);
});

test('rejects symlinked presentation source', () => {
  const root = fixture();
  const outside = path.join(root, 'outside.tsx');
  const target = path.join(root, 'app/soapbox/components/symlink.tsx');
  fs.writeFileSync(outside, 'export default null;\n');
  fs.symlinkSync(outside, target);
  assert.throws(() => run(root), /symlinked source is not allowed/);
});
