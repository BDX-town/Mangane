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
  { functionName: 'handlePush', expression: "fetchFromApi(`/api/v1/notifications/${notification_id}`, 'get', access_token)" },
  { functionName: 'handleNotificationClick', expression: "fetchFromApi(`/api/v1/statuses/${data.id}/reblog`, 'post', data.access_token)" },
  { functionName: 'handleNotificationClick', expression: "fetchFromApi(`/api/v1/statuses/${data.id}/favourite`, 'post', data.access_token)" },
  { functionName: 'handleNotificationClick', expression: 'resolve(openUrl(event.notification.data.url))' },
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

// Replace comments and literal contents with whitespace while preserving offsets and
// template-expression code. This prevents comments and inert string text from
// satisfying executable call-site checks without introducing a parser dependency.
const executableMask = source => {
  const chars = [...source];
  let i = 0;
  let state = 'code';
  let quote = null;
  let templateExpressionDepth = 0;
  while (i < chars.length) {
    const current = chars[i];
    const next = chars[i + 1];
    if (state === 'lineComment') {
      if (current === '\n') state = 'code'; else chars[i] = ' ';
      i += 1;
      continue;
    }
    if (state === 'blockComment') {
      if (current === '*' && next === '/') {
        chars[i] = chars[i + 1] = ' ';
        i += 2;
        state = 'code';
      } else {
        if (current !== '\n') chars[i] = ' ';
        i += 1;
      }
      continue;
    }
    if (state === 'string') {
      if (current === '\\') {
        chars[i] = ' ';
        if (i + 1 < chars.length && chars[i + 1] !== '\n') chars[i + 1] = ' ';
        i += 2;
      } else if (current === quote) {
        chars[i] = ' ';
        state = 'code';
        quote = null;
        i += 1;
      } else {
        if (current !== '\n') chars[i] = ' ';
        i += 1;
      }
      continue;
    }
    if (state === 'template') {
      if (current === '\\') {
        chars[i] = ' ';
        if (i + 1 < chars.length && chars[i + 1] !== '\n') chars[i + 1] = ' ';
        i += 2;
      } else if (current === '`') {
        chars[i] = ' ';
        state = 'code';
        i += 1;
      } else if (current === '$' && next === '{') {
        chars[i] = chars[i + 1] = ' ';
        templateExpressionDepth = 1;
        state = 'templateExpression';
        i += 2;
      } else {
        if (current !== '\n') chars[i] = ' ';
        i += 1;
      }
      continue;
    }
    if (state === 'templateExpression') {
      if (current === '{') templateExpressionDepth += 1;
      if (current === '}') {
        templateExpressionDepth -= 1;
        if (templateExpressionDepth === 0) {
          chars[i] = ' ';
          state = 'template';
          i += 1;
          continue;
        }
      }
    }
    if (current === '/' && next === '/') {
      chars[i] = chars[i + 1] = ' ';
      state = 'lineComment';
      i += 2;
    } else if (current === '/' && next === '*') {
      chars[i] = chars[i + 1] = ' ';
      state = 'blockComment';
      i += 2;
    } else if (current === '"' || current === "'") {
      chars[i] = ' ';
      quote = current;
      state = 'string';
      i += 1;
    } else if (current === '`') {
      chars[i] = ' ';
      state = 'template';
      i += 1;
    } else {
      i += 1;
    }
  }
  if (state === 'blockComment' || state === 'string' || state === 'template') fail(`unterminated ${state} in worker source`);
  return chars.join('');
};

const findMatchingBrace = (masked, openingIndex) => {
  let depth = 0;
  for (let i = openingIndex; i < masked.length; i += 1) {
    if (masked[i] === '{') depth += 1;
    else if (masked[i] === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  fail(`unterminated function body at offset ${openingIndex}`);
};
const functionBody = (source, masked, functionName) => {
  const declaration = new RegExp(`\\bconst\\s+${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{`, 'g');
  const matches = [...masked.matchAll(declaration)];
  if (matches.length !== 1) fail(`expected exactly one executable ${functionName} declaration, found ${matches.length}`);
  const openingIndex = matches[0].index + matches[0][0].lastIndexOf('{');
  const closingIndex = findMatchingBrace(masked, openingIndex);
  return { source: source.slice(openingIndex + 1, closingIndex), masked: masked.slice(openingIndex + 1, closingIndex) };
};
const normalizeExecutable = value => value.replace(/\s+/g, ' ').trim();
const validateExecutableBinding = (source, masked, binding) => {
  const body = functionBody(source, masked, binding.functionName);
  const normalizedBody = normalizeExecutable(body.masked);
  const normalizedExpression = normalizeExecutable(executableMask(binding.expression));
  if (!normalizedBody.includes(normalizedExpression)) {
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
const maskedSource = executableMask(source);
for (const binding of expectedCallSiteBindings) validateExecutableBinding(source, maskedSource, binding);

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