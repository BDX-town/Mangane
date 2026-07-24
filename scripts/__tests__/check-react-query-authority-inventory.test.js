'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

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
    'app/soapbox/queries/carousels.ts',
    'app/soapbox/queries/trends.ts',
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

describe('React Query authority inventory drift gate', () => {
  it('verifies the bounded current query inventory', () => {
    expect(JSON.parse(run())).toMatchObject({ checkedQueries: 2, keys: ['carouselAvatars', 'trends'] });
  });

  it('fails when a query key changes without inventory reconciliation', () => {
    const root = fixture();
    mutate(root, 'app/soapbox/queries/trends.ts', source => source.replace("['trends']", "['trends', 'instance']"));
    expect(() => run(root)).toThrow(/exact unscoped query key trends/);
  });

  it('fails when the verified Redux duplication boundary disappears', () => {
    const root = fixture();
    mutate(root, 'app/soapbox/queries/trends.ts', source => source.replace('dispatch(fetchTrendsSuccess(data));', 'void data;'));
    expect(() => run(root)).toThrow(/duplication boundary/);
  });

  it('fails when a query endpoint drifts', () => {
    const root = fixture();
    mutate(root, 'app/soapbox/queries/carousels.ts', source => source.replace('/api/v1/truth/carousels/avatars', '/api/v2/carousels/avatars'));
    expect(() => run(root)).toThrow(/no longer contains endpoint/);
  });
});
