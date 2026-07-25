'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.PUSH_WORKER_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'push-worker-authority-inventory.json');
const fail = message => { throw new Error(`push-worker-authority: ${message}`); };

const expectedUnknowns = [
  'Repository-wide push subscription creation, rotation and revocation enumeration remains incomplete.',
  'Account and instance binding for push payloads, subscriptions and grouped notifications is not proven.',
  'Logout, account removal and instance switching cleanup of credential-bearing native notifications is not proven.',
  'Push payload schema, size limits, locale validation and fallback field validation are not verified.',
  'Worker request timeout, cancellation, response-size, retry, content-type and error contracts are not verified.',
  'Notification click destinations are not proven to be constrained to safe same-origin application routes.',
];
const expectedInvariants = [
  'notificationDataCurrentlyMayContainBearerToken',
  'pushPayloadCurrentlySuppliesBearerToken',
  'notificationActionsCurrentlyReusePersistedBearerToken',
  'clickDestinationCurrentlyLacksSharedDestinationPolicy',
  'passingGateDoesNotClaimWorkerIsHardened',
];
const expectedFragments = [
  'access_token?: string',
  "'Authorization': `Bearer ${accessToken}`",
  "credentials: 'include'",
  'const { access_token, notification_id, preferred_locale, title, body, icon } = event.data?.json();',
  'data:      { access_token, preferred_locale',
  "data: { access_token, preferred_locale, url: '/notifications' }",
  'self.clients.openWindow(url)',
  'return client.navigate(url).then(client => client?.focus());',
  "self.addEventListener('push', handlePush);",
  "self.addEventListener('notificationclick', handleNotificationClick);",
];
const expectedCallSiteBindings = [
  "fetchFromApi(`/api/v1/notifications/${notification_id}`, 'get', access_token)",
  "fetchFromApi(`/api/v1/statuses/${data.id}/reblog`, 'post', data.access_token)",
  "fetchFromApi(`/api/v1/statuses/${data.id}/favourite`, 'post', data.access_token)",
  'resolve(openUrl(event.notification.data.url))',
];
const expectedDocumentation = {
  path: 'docs/architecture/PUSH_WORKER_AUTHORITY_DRIFT_GATE.md',
  requiredFragments: [
    'A passing gate does **not** mean this behavior is safe or accepted target architecture.',
    'Credential-bearing notification data is a release-blocking legacy boundary',
    'The gate exists so the behavior cannot silently change, disappear from documentation, or be mistaken for a completed security contract.',
    'safe same-origin notification destination policy',
    'replacement of notification-resident bearer tokens with scoped session or action-capability handling',
  ],
};

const readInsideRoot = (relativePath, label) => {
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe ${label} path ${relativePath}`);
  return fs.readFileSync(absolute, 'utf8');
};
const validateExactList = (actual, expected, label) => {
  if (!Array.isArray(actual) || actual.length !== expected.length || new Set(actual).size !== expected.length) {
    fail(`${label} changed without checker reconciliation`);
  }
  for (const item of expected) {
    if (!actual.includes(item)) fail(`required ${label} item is missing: ${item}`);
  }
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (manifest.status !== 'verified-current-bounded') fail('status changed without reconciliation');

const surface = manifest.surface;
if (!surface || surface.path !== 'app/soapbox/service_worker/web_push_notifications.ts') fail('push worker surface changed without reconciliation');
validateExactList(surface.requiredFragments, expectedFragments, 'manifest fragment');
validateExactList(surface.requiredCallSiteBindings, expectedCallSiteBindings, 'call-site binding');
const source = readInsideRoot(surface.path, 'worker');
for (const fragment of [...expectedFragments, ...expectedCallSiteBindings]) {
  if (!source.includes(fragment)) fail(`${surface.path} no longer contains push-worker evidence: ${fragment}`);
}

const documentation = manifest.canonicalDocumentation;
if (!documentation || documentation.path !== expectedDocumentation.path) fail('canonical documentation path changed without reconciliation');
validateExactList(documentation.requiredFragments, expectedDocumentation.requiredFragments, 'documentation fragment');
const documentationSource = readInsideRoot(documentation.path, 'documentation');
for (const fragment of expectedDocumentation.requiredFragments) {
  if (!documentationSource.includes(fragment)) fail(`${documentation.path} no longer contains required security evidence: ${fragment}`);
}

validateExactList(manifest.explicitUnknowns, expectedUnknowns, 'explicit unknown');
for (const invariant of expectedInvariants) {
  if (manifest.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedSurface: surface.path,
  checkedFragments: expectedFragments.length,
  checkedCallSiteBindings: expectedCallSiteBindings.length,
  checkedDocumentationFragments: expectedDocumentation.requiredFragments.length,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
