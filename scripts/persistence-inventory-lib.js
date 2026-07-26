'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const EXCLUDED = new Set(['__fixtures__', '__tests__', 'jest', 'locales', 'vendor']);

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const absolute = path.join(directory, entry.name);
  if (entry.isDirectory()) return EXCLUDED.has(entry.name) ? [] : walk(absolute);
  return EXTENSIONS.has(path.extname(entry.name)) ? [absolute] : [];
});

const lineAt = (source, offset) => source.slice(0, offset).split('\n').length;
const compact = expression => expression.replace(/\s+/g, ' ').trim().slice(0, 240);
const keyOf = expression => {
  const value = compact(expression);
  if (/^(['"`]).*\1$/.test(value)) return value.slice(1, -1);
  return '<dynamic>';
};

const metadata = (file, engine, operation, expression) => {
  const lower = `${file} ${expression}`.toLowerCase();
  const objectUrl = engine === 'object-url';
  const notification = engine === 'notification-store';
  const credential = /auth|token|external/.test(lower) || notification;
  let authority = 'cache-setting-or-projection';
  if (credential) authority = 'sensitive-state-or-credential-copy';
  else if (objectUrl) authority = 'temporary-resource';
  else if (engine === 'react-query') authority = 'in-memory-cache';

  let owner = 'component-or-utility';
  if (file.includes('/actions/')) owner = 'redux-action';
  else if (file.includes('/reducers/')) owner = 'redux-reducer';
  else if (file.includes('service_worker')) owner = 'service-worker';

  return {
    owner,
    authority,
    accountScope: credential ? 'account-scope-required-or-unproven' : 'none-or-callsite-defined',
    instanceScope: /instance|host|baseurl/.test(lower) ? 'host-keyed-or-explicit' : 'none-or-callsite-defined',
    deploymentScope: 'origin-and-build-namespace',
    version: 'unversioned-unless-key-encodes-version',
    ttl: objectUrl ? 'component-lifetime-required' : 'none-observed',
    encryption: credential ? 'plaintext-browser-readable' : 'not-required-or-unproven',
    migration: /legacy|auth:app|auth:user/.test(lower) ? 'legacy-read-path' : 'none-observed',
    corruptionRecovery: operation === 'clear' ? 'destructive-reset-only' : 'none-observed',
    quotaHandling: 'none-observed',
    cleanupTrigger: objectUrl && operation === 'revoke' ? 'explicit-revoke' : 'none-or-callsite-defined',
    logoutBehavior: credential ? 'must-delete-or-invalidate' : 'unproven-or-retained',
    staleResurrectionRisk: credential || engine === 'react-query' || notification ? 'high' : 'bounded-or-unproven',
  };
};

const discover = root => {
  const calls = [];
  const roots = ['app', 'webpack'].map(item => path.join(root, item)).filter(fs.existsSync);
  const patterns = [
    ['localStorage', /\blocalStorage\.(getItem|setItem|removeItem|clear)\s*\(\s*([^,\n)]*)/g],
    ['sessionStorage', /\bsessionStorage\.(getItem|setItem|removeItem|clear)\s*\(\s*([^,\n)]*)/g],
    ['localForage/IndexedDB', /\bKVStore\.(getItemOrError|getItem|setItem|removeItem|clear)\s*\(\s*([^,\n)]*)/g],
    ['cache-storage', /\b(?:caches|cacheStorage)\.(open|keys|delete|match)\s*\(\s*([^,\n)]*)/g],
    ['object-url', /\b(?:window\.)?URL\.(createObjectURL|revokeObjectURL)\s*\(\s*([^,\n)]*)/g],
    ['notification-store', /\b(?:self\.registration|serviceWorkerRegistration)\.(showNotification|getNotifications)\s*\(\s*([^,\n)]*)/g],
    ['react-query', /\bnew\s+QueryClient\s*\(\s*([^;\n]*)/g],
    ['blob-buffer', /\bnew\s+(Blob|FileReader)\s*\(\s*([^;\n]*)/g],
    ['cross-tab', /\bnew\s+BroadcastChannel\s*\(\s*([^,\n)]*)/g],
  ];

  for (const absolute of roots.flatMap(walk)) {
    const source = fs.readFileSync(absolute, 'utf8');
    const file = path.relative(root, absolute).split(path.sep).join('/');
    for (const [engine, regex] of patterns) {
      for (const match of source.matchAll(regex)) {
        const operation = match[1];
        const expression = match[2] || '';
        const identity = `${file}:${lineAt(source, match.index)}:${engine}:${operation}:${compact(expression)}`;
        calls.push({
          id: crypto.createHash('sha256').update(identity).digest('hex').slice(0, 16),
          file,
          line: lineAt(source, match.index),
          engine,
          operation,
          key: keyOf(expression),
          expression: compact(expression),
          ...metadata(file, engine, operation, expression),
        });
      }
    }
  }

  calls.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.id.localeCompare(b.id));
  return {
    schemaVersion: 1,
    generatedBy: 'scripts/generate-persistence-manifest.js',
    coverage: { roots: ['app', 'webpack'], excluded: [...EXCLUDED].sort() },
    invariants: {
      localCleanupIndependentOfRemoteRevocation: true,
      purgeIsOrderedIdempotentAndResumable: true,
      sensitiveStateRequiresAccountAndInstanceScope: true,
      objectUrlsRequireDeterministicRevocation: true,
      staleActorsCannotRestorePurgedState: true,
    },
    purgeOrder: [
      'persist-tombstone-revoke-generation-and-propagate-cross-tab',
      'disconnect-streams-and-polling',
      'cancel-and-clear-react-query',
      'attempt-bounded-remote-revocation',
      'remove-local-redux-account-state',
      'remove-serialized-account-credentials-and-selection',
      'delete-account-indexeddb-snapshot',
      'remove-transient-oauth-credentials',
      'delete-application-owned-cache-storage',
      'persist-worker-revocation-unsubscribe-push-and-close-notifications',
      'revoke-tracked-object-urls-and-temporary-resources',
      'complete-lifecycle-and-tombstone-only-after-local-success',
    ],
    calls,
  };
};

module.exports = { discover };
