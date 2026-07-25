'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(process.env.BROWSER_PERSISTENCE_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'browser-persistence-authority-inventory.json');
const fail = message => {
  throw new Error(`browser-persistence-authority: ${message}`);
};

const requiredSurfaceIds = [
  'auth-local-storage',
  'account-credential-cleanup',
  'indexeddb-account-snapshot',
  'durable-lifecycle-generation',
  'http-response-generation-fence',
  'stream-generation-fence',
  'cross-tab-purge',
  'offline-cache-cleanup',
  'durable-worker-revocation',
  'object-url-registry',
  'ordered-resumable-purge',
  'origin-emergency-reset',
];
const requiredInvariants = [
  'allDiscoveredCallsClassified',
  'credentialCleanupFailsClosed',
  'crossTabMessagesContainNoBearerTokens',
  'lateResponsesAndWritesAreGenerationFenced',
  'normalLogoutClearsOwnedCaches',
  'objectUrlsAreCentrallyRevocable',
  'purgeIsOrderedIdempotentResumableAndFailureIsolated',
  'workerRevocationSurvivesWorkerRestart',
];

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 2) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (manifest.status !== 'phase-0c-verified') fail(`unexpected status ${manifest.status}`);
if (!Array.isArray(manifest.surfaces) || manifest.surfaces.length === 0) fail('surfaces must be a non-empty array');
if (!Array.isArray(manifest.documentedConstraints) || manifest.documentedConstraints.length === 0) fail('documentedConstraints must be a non-empty array');

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

for (const requiredId of requiredSurfaceIds) {
  if (!seenIds.has(requiredId)) fail(`required Phase 0C surface ${requiredId} is missing`);
}
for (const invariant of requiredInvariants) {
  if (manifest.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
}
if (manifest.surfaces.length !== requiredSurfaceIds.length) fail('unreviewed authority surface count drift');

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedSurfaces: manifest.surfaces.length,
  sensitiveSurfaces,
  engines: [...new Set(manifest.surfaces.map(surface => surface.engine))].sort(),
  documentedConstraints: manifest.documentedConstraints.length,
}, null, 2)}\n`);
