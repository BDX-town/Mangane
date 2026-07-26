'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { inventoryRepository, toMarkdown } = require('../architecture-inventory');

function write(root, relativePath, content) {
  const fullPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

describe('architecture inventory', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'mangane-inventory-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  test('finds security-sensitive and server-state call sites with stable paths and line numbers', () => {
    write(root, 'app/z.ts', 'const value = localStorage.getItem(\'token\');\nuseQuery([\'z\'], load);\n');
    write(root, 'app/a.tsx', 'queryClient.invalidateQueries([\'a\']);\nnode.innerHTML = html;\n');

    const result = inventoryRepository(root);

    expect(result.generatedAt).toBeNull();
    expect(result.scannedFiles).toBe(2);
    expect(result.findings).toEqual([
      { category: 'html.innerHTML', file: 'app/a.tsx', count: 1, lines: [2] },
      { category: 'reactQuery.invalidateQueries', file: 'app/a.tsx', count: 1, lines: [1] },
      { category: 'reactQuery.useQuery', file: 'app/z.ts', count: 1, lines: [2] },
      { category: 'storage.localStorage', file: 'app/z.ts', count: 1, lines: [1] },
    ]);
  });

  test('matches React Query calls with nested TypeScript generic arguments', () => {
    write(
      root,
      'app/query.ts',
      'useQuery<ReadonlyArray<Tag>>([\'trends\'], load);\nuseMutation<Result<Map<string, Tag>>>(save);\n',
    );

    const result = inventoryRepository(root);

    expect(result.findings).toEqual([
      { category: 'reactQuery.useMutation', file: 'app/query.ts', count: 1, lines: [2] },
      { category: 'reactQuery.useQuery', file: 'app/query.ts', count: 1, lines: [1] },
    ]);
  });

  test('ignores unsupported files, dependency trees, build outputs, and symlinks', () => {
    write(root, 'app/visible.js', 'fetch("/api");\n');
    write(root, 'app/ignored.txt', 'localStorage');
    write(root, 'node_modules/pkg/index.js', 'localStorage');
    write(root, 'dist/bundle.js', 'localStorage');

    const outside = path.join(root, 'outside.js');
    fs.writeFileSync(outside, 'localStorage');
    fs.symlinkSync(outside, path.join(root, 'app', 'linked.js'));

    const result = inventoryRepository(root, ['app', 'node_modules', 'dist']);

    expect(result.scannedFiles).toBe(1);
    expect(result.findings).toEqual([
      { category: 'network.fetch', file: 'app/visible.js', count: 1, lines: [1] },
    ]);
  });

  test('produces deterministic markdown without timestamps', () => {
    write(root, 'app/query.ts', 'useMutation(save);\n');

    const first = toMarkdown(inventoryRepository(root));
    const second = toMarkdown(inventoryRepository(root));

    expect(first).toBe(second);
    expect(first).toContain('| reactQuery.useMutation | `app/query.ts` | 1 | 1 |');
    expect(first).not.toMatch(/generated at/i);
  });
});