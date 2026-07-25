'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.REACT_QUERY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'react-query-authority-inventory.json');
const fail = message => {
  throw new Error(`react-query-authority: ${message}`);
};

const expectedQueries = [
  { path: 'app/soapbox/queries/carousels.ts', key: 'carouselAvatars', endpoint: '/api/v1/truth/carousels/avatars', usesStatefulApi: true, duplicatesIntoRedux: false },
  { path: 'app/soapbox/queries/trends.ts', key: 'trends', endpoint: '/api/v1/trends', usesStatefulApi: true, duplicatesIntoRedux: true },
];
const expectedInfiniteQueries = [
  { path: 'app/soapbox/queries/suggestions.ts', key: ['suggestions', 'v2'], endpoint: '/api/v2/suggestions', usesStatefulApi: true, duplicatesIntoRedux: true },
];
const expectedLifecycleOperations = [
  { path: 'app/soapbox/persistence/purge.ts', operation: 'cancel-and-clear-on-account-purge', requiredCalls: ['cancelQueries'], requiredMemberCalls: ['queryClient.clear'] },
  { path: 'app/soapbox/persistence/emergency-reset.ts', operation: 'cancel-and-clear-on-emergency-reset', requiredCalls: ['cancelQueries'], requiredMemberCalls: ['queryClient.clear'] },
];
const expectedUnknowns = [
  'Repository-wide React Query call-site enumeration remains incomplete outside the executable API scan enforced by this bounded gate.',
  'Logout cancels and clears the singleton cache and stateful HTTP responses are generation-fenced, but query keys still omit explicit account and instance dimensions.',
  'The carousel endpoint\'s authentication and cross-instance variability remain unverified.',
  'The trends query duplicates authority into Redux and has no verified cross-store purge contract.',
  'The suggestions query key omits account and instance scope while its results are duplicated into Redux account and relationship state.',
  'Mutation, optimistic update, rollback, hydration, persistence and stream-to-cache paths are not proven absent.',
  'A passing gate records inherited behavior and does not classify either query as safely shareable across accounts or instances.',
];
const unsupportedCallApis = [
  'useQueries', 'useMutation', 'fetchQuery', 'prefetchQuery', 'ensureQueryData',
  'getQueryData', 'setQueryData', 'setQueriesData', 'invalidateQueries', 'removeQueries',
  'resetQueries', 'dehydrate', 'persistQueryClient',
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
    if (source[i] === '\\') {
      i += 2; continue;
    }
    if (source[i] === quote) return i + 1;
    i += 1;
  }
  fail('unterminated string while scanning React Query APIs');
};
const skipTrivia = (source, start) => {
  let i = start;
  while (i < source.length) {
    if (/\s/.test(source[i])) {
      i += 1; continue;
    }
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
    if (source[i] === '"' || source[i] === '\'' || source[i] === '`') {
      i = skipQuoted(source, i); continue;
    }
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
          if (source[cursor] === '"' || source[cursor] === '\'' || source[cursor] === '`') {
            cursor = skipQuoted(source, cursor); continue;
          }
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
    if (source[i] === '"' || source[i] === '\'' || source[i] === '`') {
      i = skipQuoted(source, i); continue;
    }
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
    if (source[i] === '"' || source[i] === '\'' || source[i] === '`') {
      i = skipQuoted(source, i); continue;
    }
    if (source[i] === '/' && (source[i + 1] === '/' || source[i + 1] === '*')) {
      i = skipTrivia(source, i); continue;
    }
    if (source[i] === '[') square += 1;
    else if (source[i] === ']') square -= 1;
    else if (source[i] === '(') round += 1;
    else if (source[i] === ')') {
      if (square === 0 && round === 0 && curly === 0) return source.slice(start, i); round -= 1;
    } else if (source[i] === '{') curly += 1;
    else if (source[i] === '}') curly -= 1;
    else if (source[i] === ',' && square === 0 && round === 0 && curly === 0) return source.slice(start, i);
    i += 1;
  }
  fail('unterminated React Query call');
};
const parseStringArray = expression => {
  let i = skipTrivia(expression, 0);
  if (expression[i] !== '[') return null;
  i = skipTrivia(expression, i + 1);
  const values = [];
  while (expression[i] !== ']') {
    const quote = expression[i];
    if (quote !== '\'' && quote !== '"') return null;
    i += 1;
    let value = '';
    while (i < expression.length) {
      if (expression[i] === '\\') {
        if (i + 1 >= expression.length) return null;
        value += expression[i + 1];
        i += 2;
        continue;
      }
      if (expression[i] === quote) {
        i += 1; break;
      }
      value += expression[i];
      i += 1;
    }
    values.push(value);
    i = skipTrivia(expression, i);
    if (expression[i] === ',') i = skipTrivia(expression, i + 1);
    else if (expression[i] !== ']') return null;
  }
  i = skipTrivia(expression, i + 1);
  return i === expression.length ? values : null;
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (manifest.status !== 'verified-current-bounded') fail('status changed without reconciliation');
validateExactList(manifest.queries, expectedQueries, 'query', query => JSON.stringify(query));
validateExactList(manifest.infiniteQueries, expectedInfiniteQueries, 'infinite query', query => JSON.stringify(query));
validateExactList(manifest.lifecycleOperations, expectedLifecycleOperations, 'lifecycle operation', operation => JSON.stringify(operation));
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
  const key = parseStringArray(firstArgument(source, calls[0]));
  if (JSON.stringify(key) !== JSON.stringify([query.key])) fail(`${query.path} no longer declares exact unscoped query key ${query.key}`);
  if (!source.includes(query.endpoint)) fail(`${query.path} no longer contains endpoint ${query.endpoint}`);
  if (query.usesStatefulApi && !/const\s+api\s*=\s*useApi\(\)/.test(source)) fail(`${query.path} no longer uses the stateful useApi client`);
  if (query.duplicatesIntoRedux && !/dispatch\s*\(\s*fetchTrendsSuccess\s*\(/.test(source)) fail(`${query.path} no longer records the React Query-to-Redux duplication boundary`);
}

for (const query of expectedInfiniteQueries) {
  const source = readInsideRoot(query.path, 'infinite query source');
  const calls = findExecutableCalls(source, 'useInfiniteQuery');
  if (calls.length !== 1) fail(`${query.path} must contain exactly one executable useInfiniteQuery invocation; found ${calls.length}`);
  const key = parseStringArray(firstArgument(source, calls[0]));
  if (JSON.stringify(key) !== JSON.stringify(query.key)) fail(`${query.path} no longer declares exact unscoped query key ${query.key.join('/')}`);
  if (!source.includes(query.endpoint)) fail(`${query.path} no longer contains endpoint ${query.endpoint}`);
  if (query.usesStatefulApi && !/const\s+api\s*=\s*useApi\(\)/.test(source)) fail(`${query.path} no longer uses the stateful useApi client`);
  if (query.duplicatesIntoRedux && !/dispatch\s*\(\s*importFetchedAccounts\s*\(/.test(source)) fail(`${query.path} no longer records its React Query-to-Redux account duplication boundary`);
  if (query.duplicatesIntoRedux && !/dispatch\s*\(\s*fetchRelationships\s*\(/.test(source)) fail(`${query.path} no longer records its React Query-to-Redux relationship duplication boundary`);
}

for (const operation of expectedLifecycleOperations) {
  const source = readInsideRoot(operation.path, 'lifecycle operation source');
  for (const call of operation.requiredCalls) {
    const calls = findExecutableCalls(source, call);
    if (calls.length !== 1) fail(`${operation.path} must contain exactly one executable ${call} lifecycle call; found ${calls.length}`);
  }
  for (const memberCall of operation.requiredMemberCalls) {
    const [object, method] = memberCall.split('.');
    const calls = findExecutableCalls(source, method);
    const pattern = new RegExp(`${object}\\s*\\.\\s*${method}\\s*$`);
    const matches = calls.filter(openParen => pattern.test(source.slice(Math.max(0, openParen - 80), openParen)));
    if (matches.length !== 1) fail(`${operation.path} must contain exactly one executable ${memberCall} lifecycle call; found ${matches.length}`);
  }
}

const appRoot = path.join(root, 'app');
const sourceFiles = walk(appRoot);
const discoveredUseQuery = [];
const discoveredUseInfiniteQuery = [];
const discoveredCancelQueries = [];
const discoveredUnsupported = [];
for (const absolute of sourceFiles) {
  const source = fs.readFileSync(absolute, 'utf8');
  const relative = path.relative(root, absolute).split(path.sep).join('/');
  for (const openParen of findExecutableCalls(source, 'useQuery')) discoveredUseQuery.push(`${relative}:${openParen}`);
  for (const openParen of findExecutableCalls(source, 'useInfiniteQuery')) discoveredUseInfiniteQuery.push(`${relative}:${openParen}`);
  for (const openParen of findExecutableCalls(source, 'cancelQueries')) discoveredCancelQueries.push(`${relative}:${openParen}`);
  for (const api of unsupportedCallApis) {
    const calls = findExecutableCalls(source, api);
    for (const openParen of calls) discoveredUnsupported.push(`${relative}:${api}:${openParen}`);
  }
  if (/\.(?:jsx|tsx)$/.test(relative)) {
    for (const api of unsupportedJsxApis) {
      const count = findExecutableJsxElements(source, api);
      for (let index = 0; index < count; index += 1) discoveredUnsupported.push(`${relative}:${api}:jsx-${index + 1}`);
    }
  }
}
const expectedUseQueryCount = expectedQueries.length;
if (discoveredUseQuery.length !== expectedUseQueryCount) fail(`repository useQuery invocation count changed: expected ${expectedUseQueryCount}, found ${discoveredUseQuery.length}`);
const discoveredUseQueryPaths = discoveredUseQuery.map(item => item.slice(0, item.lastIndexOf(':'))).sort();
validateExactList(discoveredUseQueryPaths, expectedQueries.map(query => query.path).sort(), 'repository useQuery invocation');
const discoveredUseInfiniteQueryPaths = discoveredUseInfiniteQuery.map(item => item.slice(0, item.lastIndexOf(':'))).sort();
validateExactList(discoveredUseInfiniteQueryPaths, expectedInfiniteQueries.map(query => query.path).sort(), 'repository useInfiniteQuery invocation');
const discoveredCancelQueriesPaths = discoveredCancelQueries.map(item => item.slice(0, item.lastIndexOf(':'))).sort();
validateExactList(discoveredCancelQueriesPaths, expectedLifecycleOperations.map(operation => operation.path).sort(), 'repository cancelQueries invocation');
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
  checkedQueries: expectedQueries.length + expectedInfiniteQueries.length,
  keys: [...expectedQueries.map(query => query.key), ...expectedInfiniteQueries.map(query => query.key.join('/'))],
  scannedSourceFiles: sourceFiles.length,
  discoveredUseQueryInvocations: discoveredUseQuery.length,
  discoveredUseInfiniteQueryInvocations: discoveredUseInfiniteQuery.length,
  checkedLifecycleOperations: expectedLifecycleOperations.length,
  unsupportedApiCallSites: discoveredUnsupported.length,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
