'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.REACT_QUERY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'react-query-authority-inventory.json');
const fail = message => { throw new Error(`react-query-authority: ${message}`); };

const expectedQueries = [
  { path: 'app/soapbox/queries/carousels.ts', key: 'carouselAvatars', endpoint: '/api/v1/truth/carousels/avatars', usesStatefulApi: true, duplicatesIntoRedux: false },
  { path: 'app/soapbox/queries/trends.ts', key: 'trends', endpoint: '/api/v1/trends', usesStatefulApi: true, duplicatesIntoRedux: true },
];
const expectedUnknowns = [
  'Repository-wide React Query call-site enumeration remains incomplete outside the executable API scan enforced by this bounded gate.',
  'Account and instance cache cancellation, late-response rejection and purge behavior are not proven.',
  "The carousel endpoint's authentication and cross-instance variability remain unverified.",
  'The trends query duplicates authority into Redux and has no verified cross-store purge contract.',
  'Mutation, optimistic update, rollback, hydration, persistence and stream-to-cache paths are not proven absent.',
  'A passing gate records inherited behavior and does not classify either query as safely shareable across accounts or instances.',
];
const unsupportedApis = [
  'useInfiniteQuery', 'useQueries', 'useMutation', 'fetchQuery', 'prefetchQuery',
  'getQueryData', 'setQueryData', 'setQueriesData', 'invalidateQueries',
  'removeQueries', 'resetQueries', 'cancelQueries', 'dehydrate', 'persistQueryClient',
];

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
  for (const item of expectedKeys) if (!actualKeys.includes(item)) fail(`required ${label} item is missing: ${item}`);
};
const walk = directory => {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...walk(absolute));
    else if (/\.(?:js|jsx|ts|tsx)$/.test(entry.name)) results.push(absolute);
  }
  return results;
};
const executableText = source => {
  let output = '';
  let i = 0;
  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];
    if (char === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') { output += ' '; i += 1; }
      continue;
    }
    if (char === '/' && next === '*') {
      output += '  '; i += 2;
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) { output += source[i] === '\n' ? '\n' : ' '; i += 1; }
      if (i >= source.length) fail('unterminated block comment while scanning React Query APIs');
      output += '  '; i += 2;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      output += ' '; i += 1;
      while (i < source.length) {
        if (source[i] === '\\') { output += '  '; i += 2; continue; }
        if (source[i] === quote) { output += ' '; i += 1; break; }
        output += source[i] === '\n' ? '\n' : ' '; i += 1;
      }
      continue;
    }
    output += char;
    i += 1;
  }
  return output;
};
const hasExecutableCall = (source, api) => {
  const clean = executableText(source);
  const pattern = new RegExp(`\\b${api}\\s*(?:<[^;{}]*?>\\s*)?\\(`, 'g');
  return pattern.test(clean);
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (manifest.status !== 'verified-current-bounded') fail('status changed without reconciliation');
validateExactList(manifest.queries, expectedQueries, 'query', query => JSON.stringify(query));
validateExactList(manifest.explicitUnknowns, expectedUnknowns, 'explicit unknown');

const client = manifest.globalClient;
if (!client || client.path !== 'app/soapbox/queries/client.ts') fail('global client path changed without reconciliation');
validateExactList(client.requiredFragments, ['new QueryClient({', 'refetchOnWindowFocus: false', 'staleTime: 60000', 'cacheTime: Infinity'], 'global client fragment');
const clientSource = readInsideRoot(client.path, 'global client');
for (const fragment of client.requiredFragments) if (!clientSource.includes(fragment)) fail(`${client.path} no longer contains ${fragment}`);

const provider = manifest.provider;
if (!provider || provider.path !== 'app/soapbox/containers/soapbox.tsx') fail('provider path changed without reconciliation');
validateExactList(provider.requiredFragments, ['<QueryClientProvider client={queryClient}>', '</QueryClientProvider>'], 'provider fragment');
const providerSource = readInsideRoot(provider.path, 'provider');
for (const fragment of provider.requiredFragments) if (!providerSource.includes(fragment)) fail(`${provider.path} no longer contains ${fragment}`);

for (const query of expectedQueries) {
  const source = readInsideRoot(query.path, 'query source');
  if (!hasExecutableCall(source, 'useQuery')) fail(`${query.path} no longer contains an executable useQuery call`);
  const escapedKey = query.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!new RegExp(`useQuery(?:<[^;{}]*?>)?\\s*\\(\\s*\\[\\s*['\"]${escapedKey}['\"]\\s*\\]\\s*,`).test(source)) fail(`${query.path} no longer declares exact unscoped query key ${query.key}`);
  if (!source.includes(query.endpoint)) fail(`${query.path} no longer contains endpoint ${query.endpoint}`);
  if (query.usesStatefulApi && !/const\s+api\s*=\s*useApi\(\)/.test(source)) fail(`${query.path} no longer uses the stateful useApi client`);
  if (query.duplicatesIntoRedux && !/dispatch\s*\(\s*fetchTrendsSuccess\s*\(/.test(source)) fail(`${query.path} no longer records the React Query-to-Redux duplication boundary`);
}

const appRoot = path.join(root, 'app');
const sourceFiles = walk(appRoot);
const discoveredUseQuery = [];
const discoveredUnsupported = [];
for (const absolute of sourceFiles) {
  const source = fs.readFileSync(absolute, 'utf8');
  const relative = path.relative(root, absolute).split(path.sep).join('/');
  if (hasExecutableCall(source, 'useQuery')) discoveredUseQuery.push(relative);
  for (const api of unsupportedApis) if (hasExecutableCall(source, api)) discoveredUnsupported.push(`${relative}:${api}`);
}
validateExactList(discoveredUseQuery.sort(), expectedQueries.map(query => query.path).sort(), 'repository useQuery call site');
if (discoveredUnsupported.length > 0) fail(`unreconciled React Query API call sites: ${discoveredUnsupported.sort().join(', ')}`);

const invariants = manifest.invariants || {};
for (const invariant of [
  'keysAreCurrentlyUnscoped', 'globalClientSpansAccountAndInstanceTransitions',
  'cacheTimeIsCurrentlyInfinite', 'accountAndInstanceDimensionsRequiredBeforeMigration',
  'passingGateDoesNotClassifyQueriesAsSafeToShare',
]) if (invariants[invariant] !== true) fail(`required invariant ${invariant} must remain true`);

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedQueries: expectedQueries.length,
  keys: expectedQueries.map(query => query.key),
  scannedSourceFiles: sourceFiles.length,
  unsupportedApiCallSites: discoveredUnsupported.length,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
