'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
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
    'app/soapbox/queries/trends.ts',
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
const assertRunFails = (root, pattern) => assert.throws(() => run(root), error => pattern.test(`${error.stderr || ''}\n${error.message || ''}`));

test('verifies the bounded current React Query authority inventory', () => {
  const report = JSON.parse(run());
  assert.deepEqual(report.keys, ['carouselAvatars', 'trends']);
  assert.equal(report.checkedQueries, 2);
  assert.equal(report.unsupportedApiCallSites, 0);
});

test('fails when a query key changes without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/queries/trends.ts', source => source.replace("['trends']", "['trends', 'instance']"));
  assertRunFails(root, /exact unscoped query key trends/);
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
  const extra = path.join(root, 'app/extra-query.ts');
  fs.mkdirSync(path.dirname(extra), { recursive: true });
  fs.writeFileSync(extra, "const result = useQuery(['extra'], loadExtra);\n");
  assertRunFails(root, /repository useQuery call site/);
});

test('fails when an unrecorded mutation API appears', () => {
  const root = fixture();
  const extra = path.join(root, 'app/extra-mutation.ts');
  fs.mkdirSync(path.dirname(extra), { recursive: true });
  fs.writeFileSync(extra, 'const mutation = useMutation(saveValue);\n');
  assertRunFails(root, /unreconciled React Query API call sites/);
});

test('does not treat comments or strings as executable React Query calls', () => {
  const root = fixture();
  const extra = path.join(root, 'app/inert-evidence.ts');
  fs.mkdirSync(path.dirname(extra), { recursive: true });
  fs.writeFileSync(extra, "// useMutation(saveValue)\nconst text = 'useQuery([\\'fake\\'], load)';\n");
  assert.doesNotThrow(() => run(root));
});
