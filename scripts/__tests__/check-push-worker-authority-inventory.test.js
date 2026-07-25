'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-push-worker-authority-inventory.js');
const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, PUSH_WORKER_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'push-worker-authority-'));
  for (const relativePath of [
    'config/push-worker-authority-inventory.json',
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
const assertRunFails = (root, pattern) => assert.throws(() => run(root), error => pattern.test(`${error.stderr || ''}\n${error.message || ''}`));

test('verifies the bounded current push worker authority inventory', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedFragments, 10);
  assert.equal(report.explicitUnknowns, 6);
});

test('fails when notification data stops exposing the recorded token field without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace('access_token?: string', 'session_id?: string'));
  assertRunFails(root, /access_token\?: string/);
});

test('fails when bearer attachment drifts', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace("'Authorization': `Bearer ${accessToken}`", "'X-Session': accessToken"));
  assertRunFails(root, /Authorization/);
});

test('fails when credential-bearing notification persistence is silently removed from the manifest', () => {
  const root = fixture();
  mutate(root, 'config/push-worker-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.surface.requiredFragments = manifest.surface.requiredFragments.filter(fragment => !fragment.includes('data:      { access_token'));
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /requiredFragments changed|required manifest fragment/);
});

test('fails when click destination handling changes without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace('self.clients.openWindow(url)', 'self.clients.openWindow(new URL(url, self.location.origin).href)'));
  assertRunFails(root, /openWindow/);
});

test('fails when an explicit security unknown is silently removed', () => {
  const root = fixture();
  mutate(root, 'config/push-worker-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.explicitUnknowns.pop();
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /explicitUnknowns changed|required explicit unknown/);
});

test('rejects a worker path outside the repository root', () => {
  const root = fixture();
  mutate(root, 'config/push-worker-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.surface.path = '../outside.ts';
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /surface changed|unsafe worker path/);
});
