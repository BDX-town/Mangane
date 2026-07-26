'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '../..');
const typecheckScript = path.join(root, 'scripts', 'check-typecheck-baseline.js');

const runTypecheck = baselinePath => spawnSync(process.execPath, [typecheckScript], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, TYPECHECK_BASELINE_PATH: baselinePath },
});

test('accepts the exact inherited TypeScript diagnostic baseline', () => {
  const result = runTypecheck(path.join(root, 'config', 'typecheck-baseline.json'));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /0 unbaselined diagnostics/);
});

test('fails closed when the TypeScript baseline is weakened or stale', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mangane-typecheck-baseline-'));
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'config', 'typecheck-baseline.json'), 'utf8'));
  baseline.diagnosticCount -= 1;
  const baselinePath = path.join(directory, 'baseline.json');
  fs.writeFileSync(baselinePath, JSON.stringify(baseline));

  const result = runTypecheck(baselinePath);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /diagnostics drifted/);
});

test('fails closed after the inherited TypeScript debt deadline', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mangane-typecheck-expiry-'));
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'config', 'typecheck-baseline.json'), 'utf8'));
  baseline.expiresOn = '2000-01-01';
  const baselinePath = path.join(directory, 'baseline.json');
  fs.writeFileSync(baselinePath, JSON.stringify(baseline));

  const result = runTypecheck(baselinePath);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /baseline expired/);
});
