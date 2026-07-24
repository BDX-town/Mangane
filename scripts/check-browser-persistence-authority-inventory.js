'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(process.env.BROWSER_PERSISTENCE_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'browser-persistence-authority-inventory.json');
const fail = message => { throw new Error(`browser-persistence-authority: ${message}`); };

const requiredSurfaceIds = [
  'auth-local-storage',
  'auth-session-selection',
  'legacy-auth-app',
  'legacy-auth-user',
  'indexeddb-kv-store',
  'auth-account-snapshot',
  'native-notification-data',
];

const requiredUnknowns = [
  'Repository-wide localStorage and sessionStorage enumeration remains incomplete.',
  'All localForage key prefixes and schemas are not yet enumerated.',
  'Cache Storage, object URLs, uploads, drafts, outbox and telemetry buffers remain unverified.',
  'Deterministic logout, account-removal and emergency-reset purge behavior is not proven.',
];

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (!Array.isArray(manifest.surfaces) || manifest.surfaces.length === 0) fail('surfaces must be a non-empty array');
if (!Array.isArray(manifest.explicitUnknowns)) fail('explicitUnknowns must be an array');

const seenIds = new Set();
let sensitiveSurfaces = 0;
for (const surface of manifest.surfaces) {
  if (!surface || typeof surface.id !== 'string' || typeof surface.path !== 'string') fail('every surface requires id and path');
  if (seenIds.has(surface.id)) fail(`duplicate surface id ${surface.id}`);
  seenIds.add(surface.id);

  const absolute = path.resolve(root, surface.path);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe source path ${surface.path}`);
  if (!Array.isArray(surface.requiredFragments) || surface.requiredFragments.length === 0) fail(`${surface.id} requires evidence fragments`);
  if (typeof surface.engine !== 'string' || typeof surface.scope !== 'string' || typeof surface.classification !== 'string') fail(`${surface.id} requires engine, scope and classification`);

  const source = fs.readFileSync(absolute, 'utf8');
  for (const fragment of surface.requiredFragments) {
    if (typeof fragment !== 'string' || fragment.length < 3) fail(`${surface.id} contains an invalid evidence fragment`);
    if (!source.includes(fragment)) fail(`${surface.path} no longer contains evidence for ${surface.id}: ${fragment}`);
  }

  if (surface.sensitive === true) sensitiveSurfaces += 1;
}

const requiredInvariants = [
  'credentialBearingSurfacesRemainExplicit',
  'legacyCredentialCopiesRemainExplicit',
  'notificationCredentialsRemainBlocked',
  'accountAndInstanceScopeRequiredBeforeMigration',
];
for (const invariant of requiredInvariants) {
  if (manifest.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
}

for (const requiredId of requiredSurfaceIds) {
  if (!seenIds.has(requiredId)) fail(`required baseline surface ${requiredId} is missing`);
}

const unknowns = new Set(manifest.explicitUnknowns);
if (unknowns.size !== manifest.explicitUnknowns.length) fail('explicitUnknowns must not contain duplicates');
for (const requiredUnknown of requiredUnknowns) {
  if (!unknowns.has(requiredUnknown)) fail(`required explicit unknown is missing: ${requiredUnknown}`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedSurfaces: manifest.surfaces.length,
  sensitiveSurfaces,
  engines: [...new Set(manifest.surfaces.map(surface => surface.engine))].sort(),
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
