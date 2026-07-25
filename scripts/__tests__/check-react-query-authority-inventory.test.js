'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-react-query-authority-inventory.js');
const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, REACT_QUERY_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'react-query-authority-'));
  for (const relativePath of [
    'config/react-query-authority-inventory.json',
    'app/soapbox/queries/client.ts',
    'app/soapbox/queries/carousels.ts',
    'app/soapbox/queries/suggestions.ts',
    'app/soapbox/queries/trends.ts',
    'app/soapbox/persistence/emergency-reset.ts',
    'app/soapbox/persistence/purge.ts',
    'app/soapbox/containers/soapbox.tsx',
  ]) {
    const destination = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(repositoryRoot, relativePath), destination);
  }
  return root;
};
const mutate = (root, relativePath, transform) => {
  const target = path.join(root, relativePath);
  fs.writeFileSync(target, transform(fs.readFileSync(target, 'utf8')));
};
const writeExtra = (root, name, content) => {
  const target = path.join(root, 'app', name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
};
const assertRunFails = (root, pattern) => assert.throws(() => run(root), error => pattern.test(`${error.stderr || ''}\n${error.message || ''}`));

test('verifies the bounded current React Query authority inventory', () => {
  const report = JSON.parse(run());
  assert.deepEqual(report.keys, ['carouselAvatars', 'trends', 'suggestions/v2']);
  assert.equal(report.checkedQueries, 3);
  assert.equal(report.discoveredUseQueryInvocations, 2);
  assert.equal(report.discoveredUseInfiniteQueryInvocations, 1);
  assert.equal(report.checkedLifecycleOperations, 2);
  assert.equal(report.unsupportedApiCallSites, 0);
});

test('fails when a query key changes without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/queries/trends.ts', source => source.replace('[\'trends\']', '[\'trends\', \'instance\']'));
  assertRunFails(root, /exact unscoped query key trends/);
});

test('fails when whitespace inside the query-key literal changes the runtime key', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/queries/trends.ts', source => source.replace('[\'trends\']', '[\' trends \']'));
  assertRunFails(root, /exact unscoped query key trends/);
});

test('does not accept an old key preserved only in a comment or string', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/queries/trends.ts', source => source
    .replace('[\'trends\']', '[\'trends\', \'instance\']')
    .replace('import { useQuery }', '// useQuery([\'trends\'], loadOld)\nconst legacy = "useQuery([\'trends\'], loadOld)";\nimport { useQuery }'));
  assertRunFails(root, /exact unscoped query key trends/);
});

test('fails when a second useQuery invocation is added to an already recorded module', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/queries/trends.ts', source => `${source}\nconst extra = useQuery(['extra'], loadExtra);\n`);
  assertRunFails(root, /exactly one executable useQuery invocation|invocation count changed/);
});

test('fails when the suggestions scope key changes without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/queries/suggestions.ts', source => source.replace(
    '[\'suggestions\', \'v2\']',
    '[\'suggestions\', \'v2\', \'account\']',
  ));
  assertRunFails(root, /exact unscoped query key suggestions\/v2/);
});

test('fails when account purge stops cancelling queries', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/persistence/purge.ts', source => source.replace(
    'await queryClient.cancelQueries();',
    'await Promise.resolve();',
  ));
  assertRunFails(root, /cancelQueries lifecycle call|cancelQueries invocation/);
});

test('fails when account purge stops clearing the query cache', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/persistence/purge.ts', source => source.replace(
    'queryClient.clear();',
    'void queryClient;',
  ));
  assertRunFails(root, /clear lifecycle call/);
});

test('fails when emergency reset stops cancelling queries', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/persistence/emergency-reset.ts', source => source.replace(
    'await queryClient.cancelQueries();',
    'await Promise.resolve();',
  ));
  assertRunFails(root, /cancelQueries lifecycle call|cancelQueries invocation/);
});

test('fails when infinite cache retention changes without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/queries/client.ts', source => source.replace('cacheTime: Infinity', 'cacheTime: 300000'));
  assertRunFails(root, /cacheTime: Infinity/);
});

test('fails when the root provider stops using the singleton client', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/containers/soapbox.tsx', source => source.replace('<QueryClientProvider client={queryClient}>', '<QueryClientProvider client={new QueryClient()}>'));
  assertRunFails(root, /provider.*queryClient|no longer contains/);
});

test('fails when the verified Redux duplication boundary disappears', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/queries/trends.ts', source => source.replace('dispatch(fetchTrendsSuccess(data));', 'void data;'));
  assertRunFails(root, /duplication boundary/);
});

test('fails when an unrecorded useQuery call site appears', () => {
  const root = fixture();
  writeExtra(root, 'extra-query.ts', 'const result = useQuery([\'extra\'], loadExtra);\n');
  assertRunFails(root, /useQuery invocation/);
});

test('fails when an unrecorded mutation API appears', () => {
  const root = fixture();
  writeExtra(root, 'extra-mutation.ts', 'const mutation = useMutation(saveValue);\n');
  assertRunFails(root, /unreconciled React Query API call sites/);
});

test('fails when ensureQueryData starts populating cache', () => {
  const root = fixture();
  writeExtra(root, 'ensure-query.ts', 'queryClient.ensureQueryData({ queryKey: [\'extra\'], queryFn: loadExtra });\n');
  assertRunFails(root, /ensureQueryData/);
});

test('fails when Hydrate starts restoring cache state', () => {
  const root = fixture();
  writeExtra(root, 'hydrate.tsx', 'const view = <Hydrate state={dehydratedState}><App /></Hydrate>;\n');
  assertRunFails(root, /Hydrate/);
});

test('does not classify a TypeScript Hydrate assertion as JSX hydration', () => {
  const root = fixture();
  writeExtra(root, 'type-assertion.ts', 'type Hydrate = { value: string };\nconst value = <Hydrate>input;\n');
  assert.doesNotThrow(() => run(root));
});

test('does not treat comments or strings as executable React Query calls', () => {
  const root = fixture();
  writeExtra(root, 'inert-evidence.ts', '// ensureQueryData({ queryKey: [\'fake\'] })\nconst text = \'useQuery([\\\'fake\\\'], load)\';\nconst markup = \'<Hydrate state={fake} />\';\n');
  assert.doesNotThrow(() => run(root));
});
