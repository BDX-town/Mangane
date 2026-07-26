'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { localLinks } = require('../documentation-authority-lib');

const repositoryRoot = path.resolve(__dirname, '../..');
const checker = path.join(repositoryRoot, 'scripts', 'check-documentation-authority.js');
const copyPath = (root, relativePath) => {
  const destination = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(path.join(repositoryRoot, relativePath), destination, { recursive: true });
};
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mangane-documentation-authority-'));
  for (const relativePath of ['docs', 'app/icons/COPYING.md', 'ARCHITECTURE.md', 'CHANGELOG.md', 'README.md']) {
    copyPath(root, relativePath);
  }
  for (const relativePath of [
    'config/documentation-authority-registry.json',
    'config/historical-requirement-traceability.json',
  ]) copyPath(root, relativePath);
  return root;
};
const run = root => execFileSync(process.execPath, [checker], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, DOCUMENTATION_AUTHORITY_ROOT: root },
  stdio: ['ignore', 'pipe', 'pipe'],
});

test('verifies the complete Phase 0H documentation authority', () => {
  const report = JSON.parse(run(repositoryRoot));
  assert.ok(report.documents >= 89);
  assert.ok(report.historicalRequirements >= 20);
});

test('rejects a broken repository-local link', () => {
  const root = fixture();
  fs.appendFileSync(path.join(root, 'README.md'), '\n[broken](./does-not-exist.md)\n');
  assert.throws(() => run(root), /broken local link/);
});

test('rejects an unregistered new document', () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, 'docs', 'unexpected.md'), '# Unexpected\n');
  assert.throws(() => run(root), /registry drift detected/);
});

test('rejects a superseded document without its visible warning', () => {
  const root = fixture();
  const target = path.join(root, 'docs/development/running-locally.md');
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('> **Superseded documentation.**', '> Hidden'));
  assert.throws(() => run(root), /superseded-document banner/);
});

test('rejects stale Phase 0 progress claims', () => {
  const root = fixture();
  fs.appendFileSync(path.join(root, 'docs/architecture/CURRENT_STATE.md'), '\nStatus: **Current / Phase 0 in progress**\n');
  assert.throws(() => run(root), /stale Phase 0 authority language/);
});

test('rejects an incomplete historical requirement disposition', () => {
  const root = fixture();
  const target = path.join(root, 'config/historical-requirement-traceability.json');
  const requirements = JSON.parse(fs.readFileSync(target, 'utf8'));
  delete requirements.requirements[0].rationale;
  fs.writeFileSync(target, `${JSON.stringify(requirements, null, 2)}\n`);
  assert.throws(() => run(root), /is missing rationale/);
});

test('rejects unsafe local link traversal', () => {
  const root = fixture();
  fs.appendFileSync(path.join(root, 'README.md'), '\n[unsafe](../../outside.md)\n');
  assert.throws(() => run(root), /unsafe local link/);
});

test('ignores Markdown link examples inside inline and fenced code', () => {
  const source = [
    '🛡️ `[inline](missing-inline.md)`',
    '`` `[nested](missing-nested.md)` ``',
    '```md',
    '[fenced](missing-fenced.md)',
    '```',
    '~~~html',
    '<a href="missing-html.md">example</a>',
    '~~~',
    '[real](existing.md)',
  ].join('\n');
  assert.deepEqual(localLinks(source, 'README.md'), [
    { sourcePath: 'README.md', target: 'existing.md' },
  ]);
});

test('rejects a repository-local link through a symlink', t => {
  const root = fixture();
  const outside = path.join(path.dirname(root), `${path.basename(root)}-outside.md`);
  t.after(() => fs.rmSync(outside, { force: true }));
  fs.writeFileSync(outside, '# Outside\n');
  fs.symlinkSync(outside, path.join(root, 'docs', 'outside.md'));
  fs.appendFileSync(path.join(root, 'README.md'), '\n[unsafe symlink](docs/outside.md)\n');
  assert.throws(() => run(root), /unsafe local link/);
});

test('rejects historical evidence through a symlink', t => {
  const root = fixture();
  const outside = path.join(path.dirname(root), `${path.basename(root)}-evidence.md`);
  t.after(() => fs.rmSync(outside, { force: true }));
  fs.writeFileSync(outside, '# Outside evidence\n');
  fs.symlinkSync(outside, path.join(root, 'docs', 'outside-evidence.md'));
  const target = path.join(root, 'config/historical-requirement-traceability.json');
  const requirements = JSON.parse(fs.readFileSync(target, 'utf8'));
  requirements.requirements[0].evidence = 'docs/outside-evidence.md';
  fs.writeFileSync(target, `${JSON.stringify(requirements, null, 2)}\n`);
  assert.throws(() => run(root), /unsafe evidence path/);
});
