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
const unsupportedCallApis = [
  'useInfiniteQuery', 'useQueries', 'useMutation', 'fetchQuery', 'prefetchQuery', 'ensureQueryData',
  'getQueryData', 'setQueryData', 'setQueriesData', 'invalidateQueries', 'removeQueries',
  'resetQueries', 'cancelQueries', 'dehydrate', 'persistQueryClient',
];
const unsupportedJsxApis = ['Hydrate'];

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
const skipQuoted = (source, start) => {
  const quote = source[start];
  let i = start + 1;
  while (i < source.length) {
    if (source[i] === '\\') { i += 2; continue; }
    if (source[i] === quote) return i + 1;
    i += 1;
  }
  fail('unterminated string while scanning React Query APIs');
};
const skipTrivia = (source, start) => {
  let i = start;
  while (i < source.length) {
    if (/\s/.test(source[i])) { i += 1; continue; }
    if (source[i] === '/' && source[i + 1] === '/') {
      i += 2;
      while (i < source.length && source[i] !== '\n') i += 1;
      continue;
    }
    if (source[i] === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      if (end < 0) fail('unterminated block comment while scanning React Query APIs');
      i = end + 2;
      continue;
    }
    break;
  }
  return i;
};
const findExecutableCalls = (source, api) => {
  const calls = [];
  let i = 0;
  while (i < source.length) {
    i = skipTrivia(source, i);
    if (i >= source.length) break;
    if (source[i] === '"' || source[i] === "'" || source[i] === '`') { i = skipQuoted(source, i); continue; }
    if (/[A-Za-z_$]/.test(source[i])) {
      const start = i;
      i += 1;
      while (i < source.length && /[A-Za-z0-9_$]/.test(source[i])) i += 1;
      if (source.slice(start, i) !== api) continue;
      let cursor = skipTrivia(source, i);
      if (source[cursor] === '<') {
        let depth = 1;
        cursor += 1;
        while (cursor < source.length && depth > 0) {
          if (source[cursor] === '"' || source[cursor] === "'" || source[cursor] === '`') { cursor = skipQuoted(source, cursor); continue; }
          if (source[cursor] === '<') depth += 1;
          else if (source[cursor] === '>') depth -= 1;
          cursor += 1;
        }
        cursor = skipTrivia(source, cursor);
      }
      if (source[cursor] === '(') calls.push(cursor);
      continue;
    }
    i += 1;
  }
  return calls;
};
const findExecutableJsxElements = (source, name) => {
  let count = 0;
  let i = 0;
  while (i < source.length) {
    i = skipTrivia(source, i);
    if (i >= source.length) break;
    if (source[i] === '"' || source[i] === "'" || source[i] === '`') { i = skipQuoted(source, i); continue; }
    if (source[i] === '<' && source.slice(i + 1, i + 1 + name.length) === name && !/[A-Za-z0-9_$]/.test(source[i + 1 + name.length] || '')) count += 1;
    i += 1;
  }
  return count;
};
const firstArgument = (source, openParen) => {
  let i = skipTrivia(source, openParen + 1);
  const start = i;
  let square = 0;
  let round = 0;
  let curly = 0;
  while (i < source.length) {
    if (source[i] === '"' || source[i] === "'" || source[i] === '`') { i = skipQuoted(source, i); continue; }
    if (source[i] === '/' && (source[i + 1] === '/' || source[i + 1] === '*')) { i = skipTrivia(source, i); continue; }
    if (source[i] === '[') square += 1;
    else if (source[i] === ']') square -= 1;
    else if (source[i] === '(') round += 1;
    else if (source[i] === ')') { if (square === 0 && round === 0 && curly === 0) return source.slice(start, i); round -= 1; }
    else if (source[i] === '{') curly += 1;
    else if (source[i] === '}') curly -= 1;
    else if (source[i] === ',' && square === 0 && round === 0 && curly === 0) return source.slice(start, i);
    i += 1;
  }
  fail('unterminated React Query call');
};
const normalizeExpression = value => value.replace(/\s+/g, '');

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
  const calls = findExecutableCalls(source, 'useQuery');
  if (calls.length !== 1) fail(`${query.path} must contain exactly one executable useQuery invocation; found ${calls.length}`);
  const expectedKey = normalizeExpression(`['${query.key}']`);
  if (normalizeExpression(firstArgument(source, calls[0])) !== expectedKey) fail(`${query.path} no longer declares exact unscoped query key ${query.key}`);
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
  for (const openParen of findExecutableCalls(source, 'useQuery')) discoveredUseQuery.push(`${relative}:${openParen}`);
  for (const api of unsupportedCallApis) {
    const calls = findExecutableCalls(source, api);
    for (const openParen of calls) discoveredUnsupported.push(`${relative}:${api}:${openParen}`);
  }
  for (const api of unsupportedJsxApis) {
    const count = findExecutableJsxElements(source, api);
    for (let index = 0; index < count; index += 1) discoveredUnsupported.push(`${relative}:${api}:jsx-${index + 1}`);
  }
}
const expectedUseQueryCount = expectedQueries.length;
if (discoveredUseQuery.length !== expectedUseQueryCount) fail(`repository useQuery invocation count changed: expected ${expectedUseQueryCount}, found ${discoveredUseQuery.length}`);
const discoveredUseQueryPaths = discoveredUseQuery.map(item => item.slice(0, item.lastIndexOf(':'))).sort();
validateExactList(discoveredUseQueryPaths, expectedQueries.map(query => query.path).sort(), 'repository useQuery invocation');
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
  discoveredUseQueryInvocations: discoveredUseQuery.length,
  unsupportedApiCallSites: discoveredUnsupported.length,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
