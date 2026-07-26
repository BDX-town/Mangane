'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.API_TRANSPORT_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'api-transport-authority-inventory.json');
const fail = message => {
  throw new Error(`api-transport-authority: ${message}`);
};

const expectedSurfaces = new Map([
  ['central-axios-client', {
    path: 'app/soapbox/api.ts',
    classification: 'credential-bearing-http-client',
    requiredFragments: [
      'const getAuthBaseURL = createSelector([',
      'const baseURL = parseBaseURL(accountUrl) || parseBaseURL(authUserUrl);',
      'baseURL: isURL(BuildConfig.BACKEND_URL) ? BuildConfig.BACKEND_URL : baseURL,',
      '\'Authorization\': `Bearer ${accessToken}`',
      'transformResponse: [maybeParseJSON]',
      'const baseURL = me ? getAuthBaseURL(state, me) : \'\';',
      'const client = baseClient(accessToken, baseURL);',
      'client.interceptors.response.use',
      'assertSessionGenerationActive(sessionGeneration);',
      'isAccountGenerationActive(accountGeneration)',
      'return client;',
    ],
    forbiddenFragmentsUntilReconciled: [
      'timeout:',
      'maxContentLength:',
      'maxBodyLength:',
      'interceptors.request',
      'axios-retry',
    ],
  }],
  ['auth-origin-token-selection', {
    path: 'app/soapbox/utils/auth.ts',
    classification: 'broad-url-and-token-selector',
    requiredFragments: [
      'new URL(url);',
      'return new URL(url).origin;',
      'const accountUrl = state.accounts.getIn([accountId, \'url\']);',
      'return state.auth.getIn([\'users\', accountUrl, \'access_token\']) as string;',
      'return ImmutableList([',
      ']).find(isURL);',
    ],
    forbiddenFragmentsUntilReconciled: [
      'protocol === \'https:\'',
      'hostname === \'localhost\'',
      'isPrivate',
      'allowedPorts',
    ],
  }],
]);

const expectedUnknowns = [
  'Token-to-account-and-origin binding is not proven by the current shared client and selector boundary.',
  'Shared timeout, bounded-response, cancellation, retry/backoff, typed-error, rate-limit, redirect and content-type policies are not established.',
  'BACKEND_URL and account-derived destinations are not proven to enforce HTTPS, credential-free URLs, safe ports, or public-network-only hosts.',
  'Pagination next-link destinations and cross-instance redirect behavior remain unverified.',
];

const expectedInvariants = [
  'credentialsMustBindToAccountAndOrigin',
  'backendOverrideRequiresSharedUrlPolicy',
  'mutationsMustNotRetryWithoutIdempotency',
  'sharedClientSafetyControlsRemainBlocked',
  'explicitUnknownsRemainPinned',
];

const arraysEqual = (actual, expected) => Array.isArray(actual)
  && actual.length === expected.length
  && actual.every((value, index) => value === expected[index]);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (!Array.isArray(manifest.surfaces)) fail('surfaces must be an array');

const seenIds = new Set();
for (const surface of manifest.surfaces) {
  if (!surface || typeof surface.id !== 'string') fail('every surface requires an id');
  if (seenIds.has(surface.id)) fail(`duplicate surface id ${surface.id}`);
  seenIds.add(surface.id);

  const expected = expectedSurfaces.get(surface.id);
  if (!expected) fail(`unexpected API transport surface ${surface.id}`);
  if (surface.path !== expected.path) fail(`${surface.id} path changed without checker reconciliation`);
  if (surface.classification !== expected.classification) fail(`${surface.id} classification changed without checker reconciliation`);
  if (!arraysEqual(surface.requiredFragments, expected.requiredFragments)) fail(`${surface.id} evidence fragments changed without checker reconciliation`);
  if (!arraysEqual(surface.forbiddenFragmentsUntilReconciled, expected.forbiddenFragmentsUntilReconciled)) fail(`${surface.id} forbidden-fragment boundary changed without checker reconciliation`);

  const absolute = path.resolve(root, surface.path);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe source path ${surface.path}`);
  const source = fs.readFileSync(absolute, 'utf8');

  for (const fragment of expected.requiredFragments) {
    if (!source.includes(fragment)) fail(`${surface.path} no longer contains evidence for ${surface.id}: ${fragment}`);
  }
  for (const fragment of expected.forbiddenFragmentsUntilReconciled) {
    if (source.includes(fragment)) fail(`${surface.path} changed the bounded safety-control boundary for ${surface.id}: ${fragment}`);
  }
}

for (const requiredId of expectedSurfaces.keys()) {
  if (!seenIds.has(requiredId)) fail(`required API transport surface ${requiredId} is missing`);
}
if (seenIds.size !== expectedSurfaces.size) fail('API transport surface set changed without checker reconciliation');

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
  checkedSurfaces: seenIds.size,
  surfaceIds: [...seenIds],
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
