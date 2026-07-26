'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '../..');
const script = path.join(repositoryRoot, 'scripts', 'check-ci-baseline.js');
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mangane-ci-baseline-'));
  const target = path.join(root, '.github/workflows/phase-0g-quality.yml');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(repositoryRoot, '.github/workflows/phase-0g-quality.yml'), target);
  for (const relativePath of [
    'config/test-ci-baseline.json',
    'config/typecheck-baseline.json',
    'config/build-budget.json',
    'docs/architecture/TEST_AND_CI_BASELINE.md',
    'docs/architecture/FLAKY_TEST_AND_QUARANTINE_POLICY.md',
    'docs/architecture/BROWSER_WORKER_HARNESS_PLAN.md',
    'docs/architecture/ACCESSIBILITY_TEST_BASELINE.md',
    'docs/architecture/SECURITY_REGRESSION_SUITE.md',
    'docs/architecture/BUILD_AND_BUNDLE_BUDGETS.md',
  ]) {
    const destination = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(repositoryRoot, relativePath), destination);
  }
  return root;
};
const run = root => execFileSync(process.execPath, [script], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, CI_BASELINE_ROOT: root },
  stdio: ['ignore', 'pipe', 'pipe'],
});
const mutate = (root, transform) => {
  const target = path.join(root, '.github/workflows/phase-0g-quality.yml');
  fs.writeFileSync(target, transform(fs.readFileSync(target, 'utf8')));
};

test('accepts the canonical least-privilege Phase 0G workflow', () => {
  const report = JSON.parse(run(fixture()));
  assert.equal(report.jobs, 6);
  assert.deepEqual(report.permissions, { contents: 'read' });
});

test('rejects a non-blocking required check', () => {
  const root = fixture();
  mutate(root, source => source.replace('runs-on: ubuntu-latest', 'continue-on-error: true\n    runs-on: ubuntu-latest'));
  assert.throws(() => run(root), /continue-on-error is prohibited/);
});

test('rejects broadened workflow permissions', () => {
  const root = fixture();
  mutate(root, source => source.replace('contents: read', 'contents: write'));
  assert.throws(() => run(root), /permissions must remain/);
});

test('rejects mutable third-party action tags', () => {
  const root = fixture();
  mutate(root, source => source.replace('actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683', 'actions/checkout@v4'));
  assert.throws(() => run(root), /not pinned to a full commit/);
});

test('rejects checkout credentials persisted into executable PR code', () => {
  const root = fixture();
  mutate(root, source => source.replace('persist-credentials: false', 'persist-credentials: true'));
  assert.throws(() => run(root), /must not persist checkout credentials/);
});

test('rejects removal of an owner-specific required command', () => {
  const root = fixture();
  mutate(root, source => source.replace('yarn test:security-regression', 'yarn test:worker'));
  assert.throws(() => run(root), /missing required command/);
});

test('rejects a unit job that omits persistence manifest drift detection', () => {
  const root = fixture();
  mutate(root, source => source.replace('      - run: yarn check:persistence\n', ''));
  assert.throws(() => run(root), /missing required command: yarn check:persistence/);
});

test('rejects a build that skips checksum-pinned Twemoji preparation', () => {
  const root = fixture();
  mutate(root, source => source.replaceAll('yarn prepare:twemoji', 'yarn build'));
  assert.throws(() => run(root), /missing required command/);
});

test('rejects unreconciled conflict copies', () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, 'docs/architecture/Baseline 2.md'), 'stale');
  assert.throws(() => run(root), /unreconciled conflict copy/);
});
