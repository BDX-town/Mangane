'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-redux-authority-inventory.js');

const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, REDUX_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'redux-authority-'));
  for (const relativePath of ['config/redux-authority-inventory.json', 'app/soapbox/reducers/index.ts']) {
    const destination = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(repositoryRoot, relativePath), destination);
  }
  return root;
};

const mutateSource = (root, mutate) => {
  const target = path.join(root, 'app/soapbox/reducers/index.ts');
  fs.writeFileSync(target, mutate(fs.readFileSync(target, 'utf8')));
};

describe('Redux authority inventory drift gate', () => {
  it('verifies the current registry and logout retention set', () => {
    expect(JSON.parse(run())).toMatchObject({ reducers: 57, logoutWhitelist: ['instance', 'soapbox', 'custom_emojis', 'auth'] });
  });

  it('fails when a reducer is added without inventory reconciliation', () => {
    const root = fixture();
    mutateSource(root, source => source.replace('  tags,\n};', '  tags,\n  unexpected_domain,\n};'));
    expect(() => run(root)).toThrow(/reducers drifted/);
  });

  it('fails when logout retention changes in the initializer', () => {
    const root = fixture();
    mutateSource(root, source => source.replace("'instance', 'soapbox', 'custom_emojis', 'auth'", "'instance', 'soapbox', 'custom_emojis', 'auth', 'me'"));
    expect(() => run(root)).toThrow(/logoutWhitelist drifted/);
  });

  it('fails when the logout whitelist is mutated after initialization', () => {
    const root = fixture();
    mutateSource(root, source => source.replace("const whitelist: string[] = ['instance', 'soapbox', 'custom_emojis', 'auth'];", "const whitelist: string[] = ['instance', 'soapbox', 'custom_emojis', 'auth'];\n  whitelist.push('me');"));
    expect(() => run(root)).toThrow(/must remain immutable/);
  });

  it('fails when the logout switch no longer handles the exact action constant', () => {
    const root = fixture();
    mutateSource(root, source => source.replace('case AUTH_LOGGED_OUT:', "case 'AUTH_LOGGED_OUT_STANDALONE':"));
    expect(() => run(root)).toThrow(/handles logout action structurally/);
  });
});
