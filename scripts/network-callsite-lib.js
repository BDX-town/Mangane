'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const EXCLUDED_PARTS = new Set(['__fixtures__', '__tests__', 'locales', 'jest']);

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const absolute = path.join(directory, entry.name);
  if (entry.isDirectory()) return EXCLUDED_PARTS.has(entry.name) ? [] : walk(absolute);
  return SOURCE_EXTENSIONS.has(path.extname(entry.name)) ? [absolute] : [];
});

const lineAt = (source, offset) => source.slice(0, offset).split('\n').length;
const compact = value => value.replace(/\s+/g, ' ').trim().slice(0, 300);
const routeValue = expression => {
  const value = expression.trim();
  const quote = value[0];
  if ((quote === '\'' || quote === '"' || quote === '`') && value.endsWith(quote)) {
    return value.slice(1, -1);
  }
  return '<dynamic>';
};

const classify = (file, method, route, kind) => {
  const lower = `${file} ${route}`.toLowerCase();
  const mutation = !['GET', 'STREAM', 'WEBSOCKET', 'EVENTSOURCE'].includes(method);
  let owner = 'component-or-utility';
  if (file.includes('/actions/')) owner = 'redux-action';
  else if (file.includes('/queries/')) owner = 'react-query';
  else if (file.includes('service_worker')) owner = 'service-worker';

  return {
    owner,
    authentication: kind === 'fetch' ? 'callsite-dependent' : 'shared-client-or-callsite-dependent',
    accountScope: 'current-account-or-explicit-client',
    instanceScope: 'client-base-url-or-explicit-destination',
    requestBody: mutation ? 'callsite-defined' : 'none',
    responseType: lower.includes('blob') || lower.includes('media') ? 'binary-or-json' : 'json-or-callsite-defined',
    pagination: /timeline|notification|search|suggest|accounts|statuses/.test(lower) ? 'possible-link-or-id-pagination' : 'none-observed',
    timeout: 'no-shared-timeout',
    cancellation: /cancel|signal|abort/.test(lower) ? 'callsite-controlled' : 'none-observed',
    retrySafety: mutation ? 'unsafe-unless-idempotency-proven' : 'safe-with-bounds',
    rateLimitHandling: 'shared-typed-policy-absent',
    contentType: lower.includes('upload') || lower.includes('media') ? 'multipart-or-callsite-defined' : 'json-or-callsite-defined',
    maximumPayload: 'unbounded-at-shared-client',
    errorClassification: 'axios-or-native-error',
    capability: route === '<dynamic>' ? 'runtime-selected' : 'endpoint-presence-and-backend-feature',
    fallback: 'callsite-defined-or-none',
    degradedBehavior: 'error-path-or-cached-ui',
  };
};

const discover = root => {
  const sourceRoot = path.join(root, 'app');
  const calls = [];
  const add = (absolute, source, offset, kind, method, expression) => {
    const file = path.relative(root, absolute).split(path.sep).join('/');
    const route = routeValue(expression);
    const key = `${file}:${lineAt(source, offset)}:${kind}:${method}:${compact(expression)}`;
    calls.push({
      id: crypto.createHash('sha256').update(key).digest('hex').slice(0, 16),
      file,
      line: lineAt(source, offset),
      kind,
      method,
      route,
      expression: compact(expression),
      ...classify(file, method, route, kind),
    });
  };

  for (const absolute of walk(sourceRoot)) {
    const source = fs.readFileSync(absolute, 'utf8');
    const patterns = [
      ['axios', /\b(?:api(?:\([^;\n]*?\))?|axios|client)\s*\.\s*(get|post|put|patch|delete|head)\s*(?:<[^;\n]*?>)?\s*\(\s*([^,\n)]+)/g],
      ['fetch', /\bfetch\s*\(\s*([^,\n)]+)/g],
      ['websocket', /\bnew\s+WebSocket\s*\(\s*([^,\n)]+)/g],
      ['websocket-client', /\bnew\s+WebSocketClient\s*\(\s*([^,\n)]+)/g],
      ['eventsource', /\bnew\s+EventSource\s*\(\s*([^,\n)]+)/g],
    ];
    for (const [kind, regex] of patterns) {
      for (const match of source.matchAll(regex)) {
        let method = kind.toUpperCase();
        if (kind === 'axios') method = match[1].toUpperCase();
        else if (kind === 'fetch') method = 'GET';
        else if (kind.startsWith('websocket')) method = 'WEBSOCKET';
        add(absolute, source, match.index, kind, method, kind === 'axios' ? match[2] : match[1]);
      }
    }
  }

  calls.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.id.localeCompare(b.id));
  return {
    schemaVersion: 1,
    generatedBy: 'scripts/generate-network-callsite-manifest.js',
    coverage: {
      roots: ['app'],
      excluded: [...EXCLUDED_PARTS].sort(),
      syntax: ['shared/explicit Axios calls', 'fetch()', 'new WebSocket()', 'new EventSource()'],
    },
    invariants: {
      credentialBearingCallsRequireAccountAndDestinationBinding: true,
      mutationsRequireExplicitRetrySafety: true,
      unsupportedIsDistinctFromFailure: true,
      driftFailsCI: true,
    },
    calls,
  };
};

module.exports = { discover };
