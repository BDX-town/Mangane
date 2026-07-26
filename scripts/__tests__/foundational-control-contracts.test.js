'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const checker = path.join(repositoryRoot, 'scripts', 'check-foundational-control-contracts.js');

const runChecker = root => spawnSync(process.execPath, [checker], {
  cwd: repositoryRoot,
  env: { ...process.env, FOUNDATIONAL_CONTROL_ROOT: root },
  encoding: 'utf8',
});

test('records every Phase 2C control and required state', () => {
  const contract = JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, 'config', 'foundational-control-contracts.json'), 'utf8'),
  );

  assert.deepEqual(Object.keys(contract.controls).sort(), [
    'avatar',
    'button',
    'card-shell',
    'chip',
    'field',
    'icon-button',
    'list-row',
    'menu-trigger',
    'segmented-control',
  ]);
  for (const control of Object.values(contract.controls)) {
    assert.ok(control.states.includes('default'));
    assert.ok(control.nativeSemantics.length > 0);
    assert.ok(control.testEvidence.length > 0);
  }
});

test('verifies the repository contract and focus utilities', () => {
  const result = runChecker(repositoryRoot);
  assert.equal(result.status, 0, result.stderr);
});

test('fails when a required control implementation disappears', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'foundational-controls-'));
  for (const relative of ['app', 'config/foundational-control-contracts.json', 'docs/architecture/COMPONENT_STATE_CONTRACTS.md']) {
    fs.cpSync(path.join(repositoryRoot, relative), path.join(root, relative), { recursive: true });
  }
  fs.rmSync(path.join(root, 'app/soapbox/components/ui/chip/chip.tsx'));

  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}\n${result.stdout}`, /implementation missing/);
});

test('fails when contract evidence resolves through a symlink outside the repository', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'foundational-controls-'));
  for (const relative of ['app', 'config/foundational-control-contracts.json', 'docs/architecture/COMPONENT_STATE_CONTRACTS.md']) {
    fs.cpSync(path.join(repositoryRoot, relative), path.join(root, relative), { recursive: true });
  }
  const external = path.join(os.tmpdir(), `external-chip-${path.basename(root)}.tsx`);
  fs.copyFileSync(
    path.join(repositoryRoot, 'app/soapbox/components/ui/chip/chip.tsx'),
    external,
  );
  const target = path.join(root, 'app/soapbox/components/ui/chip/chip.tsx');
  fs.rmSync(target);
  fs.symlinkSync(external, target);

  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}\n${result.stdout}`, /resolves outside the repository/);
});

test('fails when focus-visible or reduced-motion behavior is removed', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'foundational-controls-'));
  for (const relative of ['app', 'config/foundational-control-contracts.json', 'docs/architecture/COMPONENT_STATE_CONTRACTS.md']) {
    fs.cpSync(path.join(repositoryRoot, relative), path.join(root, relative), { recursive: true });
  }
  const target = path.join(root, 'app/styles/components/foundational-controls.scss');
  const source = fs.readFileSync(target, 'utf8')
    .replace(':focus-visible', ':focus-policy-removed')
    .replace('prefers-reduced-motion: reduce', 'motion-policy-removed');
  fs.writeFileSync(target, source);

  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}\n${result.stdout}`, /focus-visible|reduced-motion/);
});
