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

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (manifest.status !== 'verified-current-bounded') fail('status changed without reconciliation');
const surface = manifest.surface;
if (!surface || surface.path !== 'app/soapbox/service_worker/web_push_notifications.ts') fail('push worker surface changed without reconciliation');
if (!Array.isArray(surface.requiredFragments) || surface.requiredFragments.length !== expectedFragments.length) fail('requiredFragments changed without checker reconciliation');
for (const fragment of expectedFragments) {
  if (!surface.requiredFragments.includes(fragment)) fail(`required manifest fragment is missing: ${fragment}`);
}
const absolute = path.resolve(root, surface.path);
const relative = path.relative(root, absolute);
if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe worker path ${surface.path}`);
const source = fs.readFileSync(absolute, 'utf8');
for (const fragment of expectedFragments) {
  if (!source.includes(fragment)) fail(`${surface.path} no longer contains push-worker evidence: ${fragment}`);
}
if (!Array.isArray(manifest.explicitUnknowns) || manifest.explicitUnknowns.length !== expectedUnknowns.length) fail('explicitUnknowns changed without reconciliation');
if (new Set(manifest.explicitUnknowns).size !== expectedUnknowns.length) fail('explicitUnknowns must remain unique');
for (const unknown of expectedUnknowns) {
  if (!manifest.explicitUnknowns.includes(unknown)) fail(`required explicit unknown is missing: ${unknown}`);
}
for (const invariant of expectedInvariants) {
  if (manifest.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedSurface: surface.path,
  checkedFragments: expectedFragments.length,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
