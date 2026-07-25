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
    'docs/architecture/PUSH_WORKER_AUTHORITY_DRIFT_GATE.md',
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

const notificationLookup = "fetchFromApi(`/api/v1/notifications/${notification_id}`, 'get', access_token)";

test('verifies the bounded current push worker authority inventory', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedFragments, 10);
  assert.equal(report.checkedCallSiteBindings, 4);
  assert.equal(report.checkedDocumentationFragments, 5);
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

test('fails when push-supplied credentials are disconnected from the notification lookup', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace(
    notificationLookup,
    "fetchFromApi(`/api/v1/notifications/${notification_id}`, 'get', fallbackToken)",
  ));
  assertRunFails(root, /handlePush.*executable call-site binding/);
});

test('does not accept a disconnected notification lookup preserved only in a comment', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace(
    notificationLookup,
    `fetchFromApi(\`/api/v1/notifications/\${notification_id}\`, 'get', fallbackToken) /* ${notificationLookup} */`,
  ));
  assertRunFails(root, /handlePush.*executable call-site binding/);
});

test('does not accept a disconnected notification lookup preserved only in a string literal', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace(
    notificationLookup,
    `(() => { const staleEvidence = ${JSON.stringify(notificationLookup)}; return fetchFromApi(\`/api/v1/notifications/\${notification_id}\`, 'get', fallbackToken); })()`,
  ));
  assertRunFails(root, /handlePush.*executable call-site binding/);
});

test('does not accept a disconnected notification lookup preserved in an unrelated helper', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source
    .replace(notificationLookup, "fetchFromApi(`/api/v1/notifications/${notification_id}`, 'get', fallbackToken)")
    .replace('/** ServiceWorker `push` event callback. */', `const staleNotificationLookup = () => ${notificationLookup};\n\n/** ServiceWorker \`push\` event callback. */`));
  assertRunFails(root, /handlePush.*executable call-site binding/);
});

test('fails when persisted notification credentials are disconnected from an action request', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace(
    "fetchFromApi(`/api/v1/statuses/${data.id}/reblog`, 'post', data.access_token)",
    "fetchFromApi(`/api/v1/statuses/${data.id}/reblog`, 'post', fallbackToken)",
  ));
  assertRunFails(root, /handleNotificationClick.*reblog/);
});

test('fails when the stored click destination is disconnected from openUrl', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/service_worker/web_push_notifications.ts', source => source.replace(
    'resolve(openUrl(event.notification.data.url))',
    "resolve(openUrl('/notifications'))",
  ));
  assertRunFails(root, /handleNotificationClick.*openUrl/);
});

test('fails when credential-bearing notification persistence is silently removed from the manifest', () => {
  const root = fixture();
  mutate(root, 'config/push-worker-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.surface.requiredFragments = manifest.surface.requiredFragments.filter(fragment => !fragment.includes('data:      { access_token'));
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /manifest fragment changed|required manifest fragment/);
});

test('fails when a call-site binding is reassigned to the wrong function in the manifest', () => {
  const root = fixture();
  mutate(root, 'config/push-worker-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.surface.requiredCallSiteBindings[0].functionName = 'handleNotificationClick';
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /call-site binding/);
});

test('fails when canonical documentation weakens the release-blocking warning', () => {
  const root = fixture();
  mutate(root, 'docs/architecture/PUSH_WORKER_AUTHORITY_DRIFT_GATE.md', source => source.replace(
    'Credential-bearing notification data is a release-blocking legacy boundary',
    'Credential-bearing notification data is a legacy boundary',
  ));
  assertRunFails(root, /required security evidence/);
});

test('fails when an explicit security unknown is silently removed', () => {
  const root = fixture();
  mutate(root, 'config/push-worker-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.explicitUnknowns.pop();
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /explicit unknown changed|required explicit unknown/);
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

test('rejects a documentation path outside the repository root', () => {
  const root = fixture();
  mutate(root, 'config/push-worker-authority-inventory.json', source => {
    const manifest = JSON.parse(source);
    manifest.canonicalDocumentation.path = '../warning.md';
    return `${JSON.stringify(manifest, null, 2)}\n`;
  });
  assertRunFails(root, /documentation path changed|unsafe documentation path/);
});
