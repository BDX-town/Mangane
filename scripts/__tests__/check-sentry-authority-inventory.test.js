'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-sentry-authority-inventory.js');
const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, SENTRY_AUTHORITY_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sentry-authority-'));
  for (const relativePath of ['config/sentry-authority-inventory.json', 'package.json', 'app/soapbox/build_config.js']) {
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

test('verifies the bounded current Sentry authority inventory', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedDependencies, 3);
  assert.equal(report.configurationKey, 'SENTRY_DSN');
  assert.equal(report.explicitUnknowns, 4);
});

test('fails when a Sentry dependency drifts without reconciliation', () => {
  const root = fixture();
  mutate(root, 'package.json', source => source.replace('"@sentry/react": "^7.2.0"', '"@sentry/react": "^8.0.0"'));
  assertRunFails(root, /package dependency @sentry\/react changed/);
});

test('fails when the build-time DSN surface disappears', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/build_config.js', source => source.replace('  SENTRY_DSN,\n} = process.env;', '} = process.env;'));
  assertRunFails(root, /no longer contains Sentry configuration evidence/);
});

test('fails when runtime activation uncertainty is silently removed', () => {
  const root = fixture();
  mutate(root, 'config/sentry-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.explicitUnknowns.shift();
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /explicitUnknowns changed|required explicit unknown/);
});

test('rejects configuration paths escaping the repository root', () => {
  const root = fixture();
  mutate(root, 'config/sentry-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.configurationSurface.path = '../outside.js';
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /configuration surface changed|unsafe configuration path/);
});
