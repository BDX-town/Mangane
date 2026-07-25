'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.PUSH_WORKER_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'push-worker-authority-inventory.json');
const fail = message => {
  throw new Error(`push-worker-authority: ${message}`);
};

const expectedUnknowns = [
  'Repository-wide push subscription creation, rotation and revocation enumeration remains incomplete.',
  'Account and instance binding for push payloads, subscriptions and grouped notifications is not proven.',
  'Cross-tab logout and worker-restart revocation are proven; instance-switch cleanup of retained credential-bearing native notifications remains separate.',
  'Push payload schema, size limits, locale validation and fallback field validation are not verified.',
  'Worker request timeout, cancellation, response-size, retry, content-type and error contracts are not verified.',
  'Notification click destinations are not proven to be constrained to safe same-origin application routes.',
];
const expectedInvariants = [
  'notificationDataCurrentlyMayContainBearerToken',
  'pushPayloadCurrentlySuppliesBearerToken',
  'notificationActionsCurrentlyReusePersistedBearerToken',
  'logoutRevocationIsRestartDurableAndAcknowledged',
  'clickDestinationCurrentlyLacksSharedDestinationPolicy',
  'passingGateDoesNotClaimWorkerIsHardened',
];
const expectedFragments = [
  'access_token?: string',
  '\'Authorization\': `Bearer ${accessToken}`',
  'credentials: \'include\'',
  'const { access_token, notification_id, preferred_locale, title, body, icon } = event.data?.json();',
  'data:      { access_token, preferred_locale',
  'data: { access_token, preferred_locale, url: \'/notifications\' }',
  'self.clients.openWindow(url)',
  'return client.navigate(url).then(client => client?.focus());',
  'const revokedTokens = new Set<string>();',
  'const REVOCATION_CACHE = \'soapbox-private-revocations-v1\';',
  'crypto.subtle.digest(\'SHA-256\', bytes)',
  'persistTokenRevocation(event.data.accessToken)',
  'isTokenRevoked(access_token)',
  'isTokenRevoked(accessToken)',
  'event.ports[0]?.postMessage({ type: \'PURGE_ACCOUNT_ACK\' });',
  'self.addEventListener(\'push\', handlePush);',
  'self.addEventListener(\'notificationclick\', handleNotificationClick);',
  'self.addEventListener(\'message\', handlePurgeMessage);',
];
const expectedCallSiteBindings = [
  { functionName: 'handlePush', expression: 'fetchFromApi(`/api/v1/notifications/${notification_id}`, \'get\', access_token)' },
  { functionName: 'handleNotificationClick', expression: 'fetchFromApi(`/api/v1/statuses/${data.id}/reblog`, \'post\', accessToken)' },
  { functionName: 'handleNotificationClick', expression: 'fetchFromApi(`/api/v1/statuses/${data.id}/favourite`, \'post\', accessToken)' },
  { functionName: 'handleNotificationClick', expression: 'resolve(openUrl(event.notification.data.url))' },
  { functionName: 'handlePush', expression: 'isTokenRevoked(access_token)' },
  { functionName: 'handleNotificationClick', expression: 'isTokenRevoked(accessToken)' },
  { functionName: 'handlePurgeMessage', expression: 'persistTokenRevocation(event.data.accessToken)' },
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
const validateExactList = (actual, expected, label, key = value => value) => {
  if (!Array.isArray(actual) || actual.length !== expected.length) fail(`${label} changed without checker reconciliation`);
  const actualKeys = actual.map(key);
  const expectedKeys = expected.map(key);
  if (new Set(actualKeys).size !== expectedKeys.length) fail(`${label} must remain unique`);
  for (const item of expectedKeys) {
    if (!actualKeys.includes(item)) fail(`required ${label} item is missing: ${item}`);
  }
};

const tokenize = source => {
  const tokens = [];
  let i = 0;
  const push = (kind, value, start = i) => tokens.push({ kind, value, start });
  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];
    if (/\s/.test(char)) {
      i += 1; continue;
    }
    if (char === '/' && next === '/') {
      i += 2;
      while (i < source.length && source[i] !== '\n') i += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      const start = i;
      i += 2;
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i += 1;
      if (i >= source.length) fail(`unterminated block comment at offset ${start}`);
      i += 2;
      continue;
    }
    if (char === '"' || char === '\'') {
      const quote = char;
      const start = i;
      let value = '';
      i += 1;
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') {
          if (i + 1 >= source.length) fail(`unterminated escape at offset ${i}`);
          value += source[i + 1];
          i += 2;
        } else {
          value += source[i];
          i += 1;
        }
      }
      if (i >= source.length) fail(`unterminated string at offset ${start}`);
      i += 1;
      push('string', value, start);
      continue;
    }
    if (char === '`') {
      const start = i;
      let raw = '`';
      i += 1;
      let expressionDepth = 0;
      while (i < source.length) {
        const current = source[i];
        raw += current;
        if (current === '\\') {
          if (i + 1 >= source.length) fail(`unterminated template escape at offset ${i}`);
          raw += source[i + 1];
          i += 2;
          continue;
        }
        if (current === '$' && source[i + 1] === '{') {
          raw += '{';
          expressionDepth += 1;
          i += 2;
          continue;
        }
        if (current === '}' && expressionDepth > 0) expressionDepth -= 1;
        if (current === '`' && expressionDepth === 0) {
          i += 1;
          push('template', raw, start);
          break;
        }
        i += 1;
      }
      if (tokens[tokens.length - 1]?.start !== start) fail(`unterminated template at offset ${start}`);
      continue;
    }
    if (/[A-Za-z_$]/.test(char)) {
      const start = i;
      i += 1;
      while (i < source.length && /[A-Za-z0-9_$]/.test(source[i])) i += 1;
      push('identifier', source.slice(start, i), start);
      continue;
    }
    const three = source.slice(i, i + 3);
    const two = source.slice(i, i + 2);
    if (['===', '!==', '>>>', '...'].includes(three)) {
      push('punctuation', three); i += 3; continue;
    }
    if (['=>', '?.', '==', '!=', '<=', '>=', '&&', '||', '??', '++', '--'].includes(two)) {
      push('punctuation', two); i += 2; continue;
    }
    push('punctuation', char);
    i += 1;
  }
  return tokens;
};

const findMatchingToken = (tokens, openingIndex, opening, closing) => {
  let depth = 0;
  for (let i = openingIndex; i < tokens.length; i += 1) {
    if (tokens[i].value === opening) depth += 1;
    else if (tokens[i].value === closing) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  fail(`unterminated ${opening}${closing} token sequence`);
};
const functionTokens = (tokens, functionName) => {
  const starts = [];
  for (let i = 0; i < tokens.length - 4; i += 1) {
    if (tokens[i].value === 'const' && tokens[i + 1].value === functionName && tokens[i + 2].value === '=') starts.push(i);
  }
  if (starts.length !== 1) fail(`expected exactly one executable ${functionName} declaration, found ${starts.length}`);
  let cursor = starts[0] + 3;
  if (tokens[cursor]?.value !== '(') fail(`${functionName} no longer has the expected arrow-function parameters`);
  cursor = findMatchingToken(tokens, cursor, '(', ')') + 1;
  if (tokens[cursor]?.value !== '=>' || tokens[cursor + 1]?.value !== '{') fail(`${functionName} no longer has the expected block arrow-function body`);
  const close = findMatchingToken(tokens, cursor + 1, '{', '}');
  return tokens.slice(cursor + 2, close);
};
const tokenKey = token => `${token.kind}:${token.value}`;
const containsTokenSequence = (haystack, needle) => {
  const expected = needle.map(tokenKey);
  for (let i = 0; i <= haystack.length - expected.length; i += 1) {
    let matches = true;
    for (let j = 0; j < expected.length; j += 1) {
      if (tokenKey(haystack[i + j]) !== expected[j]) {
        matches = false; break;
      }
    }
    if (matches) return true;
  }
  return false;
};
const validateExecutableBinding = (tokens, binding) => {
  const body = functionTokens(tokens, binding.functionName);
  const expressionTokens = tokenize(binding.expression);
  if (!containsTokenSequence(body, expressionTokens)) {
    fail(`${binding.functionName} no longer contains executable call-site binding: ${binding.expression}`);
  }
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (manifest.status !== 'verified-current-bounded') fail('status changed without reconciliation');

const surface = manifest.surface;
if (!surface || surface.path !== 'app/soapbox/service_worker/web_push_notifications.ts') fail('push worker surface changed without reconciliation');
validateExactList(surface.requiredFragments, expectedFragments, 'manifest fragment');
validateExactList(surface.requiredCallSiteBindings, expectedCallSiteBindings, 'call-site binding', binding => `${binding.functionName}:${binding.expression}`);
const source = readInsideRoot(surface.path, 'worker');
for (const fragment of expectedFragments) {
  if (!source.includes(fragment)) fail(`${surface.path} no longer contains push-worker evidence: ${fragment}`);
}
const tokens = tokenize(source);
for (const binding of expectedCallSiteBindings) validateExecutableBinding(tokens, binding);

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
