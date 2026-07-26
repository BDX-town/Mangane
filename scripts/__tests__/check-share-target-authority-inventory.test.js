'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-share-target-authority-inventory.js');
const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, SHARE_TARGET_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'share-target-authority-'));
  for (const relativePath of [
    'config/share-target-authority-inventory.json',
    'app/soapbox/service_worker/share_target.js',
    'app/soapbox/main.tsx',
    'docs/architecture/SHARE_TARGET_AUTHORITY_DRIFT_GATE.md',
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
const assertRunFails = (root, pattern) => assert.throws(() => run(root), error => pattern.test(`${error.stderr || ''}\n${error.message || ''}`));

test('verifies the hardened share target authority inventory', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedExecutableBindings, 17);
  assert.equal(report.checkedDocumentationFragments, 5);
  assert.equal(report.explicitUnknowns, 6);
});

test('fails when exact same-origin routing is weakened', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/share_target.js', source => source.replace('requestUrl.origin === self.location.origin', 'requestUrl.origin !== self.location.origin'));
  assertRunFails(root, /requestUrl\.origin/);
});

test('fails when a recorded field is disconnected from form data', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/share_target.js', source => source.replace('boundedText(formData.get(\'link\'), MAX_LINK_LENGTH)', 'boundedText(formData.get(\'url\'), MAX_LINK_LENGTH)'));
  assertRunFails(root, /formData\.get\('link'\)/);
});

test('fails when compose text ordering changes', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/share_target.js', source => source.replace('`${name}\\n${description}\\n\\n${link}`', '`${link}\\n${name}\\n${description}`'));
  assertRunFails(root, /const text/);
});

test('fails when the redirect destination or status changes', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/share_target.js', source => source.replace('Response.redirect(`/statuses/compose?${params.toString()}`, 303)', 'Response.redirect(`/compose?${params.toString()}`, 302)'));
  assertRunFails(root, /Response\.redirect/);
});

test('does not accept required worker behavior preserved only in a comment', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/share_target.js', source => source.replace('const link = boundedText(formData.get(\'link\'), MAX_LINK_LENGTH);', '// const link = boundedText(formData.get(\'link\'), MAX_LINK_LENGTH);\n    const link = \'\';'));
  assertRunFails(root, /formData\.get\('link'\)/);
});

test('fails when development registration points at another worker', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/main.tsx', source => source.replace('navigator.serviceWorker.register(\'/share_target.js\'', 'navigator.serviceWorker.register(\'/worker.js\''));
  assertRunFails(root, /registers the expected share-target worker/);
});

test('fails when canonical documentation weakens the browser body-size limitation', () => {
  const root = fixture();
  mutate(root, 'docs/architecture/SHARE_TARGET_AUTHORITY_DRIFT_GATE.md', source => source.replace('Browsers do not guarantee that `Content-Length` is exposed', 'Content length may be absent'));
  assertRunFails(root, /required security evidence/);
});

test('fails when an explicit unknown is silently removed', () => {
  const root = fixture();
  mutate(root, 'config/share-target-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.explicitUnknowns.pop();
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /explicit unknown changed|required explicit unknown/);
});

test('rejects a worker path outside the repository root', () => {
  const root = fixture();
  mutate(root, 'config/share-target-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.surface.path = '../outside.js';
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /surface changed|unsafe worker path/);
});
