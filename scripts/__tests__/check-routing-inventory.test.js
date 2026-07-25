'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-routing-inventory.js');
const manifest = require(path.join(repositoryRoot, 'config', 'routing-inventory.json'));

const runChecker = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, ROUTING_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const makeFixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'routing-inventory-'));
  const files = ['config/routing-inventory.json', ...manifest.sources.map(source => source.path)];
  for (const relativePath of files) {
    const source = path.join(repositoryRoot, relativePath);
    const destination = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
  return root;
};

describe('routing inventory drift gate', () => {
  it('is discovered by Jest and verifies the bounded routing evidence', () => {
    const summary = JSON.parse(runChecker());
    expect(summary).toMatchObject({
      schemaVersion: 1,
      status: 'verified-current-bounded',
      checkedSources: 7,
      developmentReservedPaths: 10,
      productionNavigationExclusions: 23,
      productionNavigationSuffixExclusions: 1,
      explicitUnknowns: 3,
    });
  });

  it('fails when a development reserved path drifts out of its owning source', () => {
    const root = makeFixture();
    const target = path.join(root, 'webpack', 'development.js');
    fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('\'/pleroma\'', '\'/pleroma-removed\''));

    expect(() => runChecker(root)).toThrow(/developmentReservedPaths value "\/pleroma"/);
  });

  it('fails when a production navigation exclusion drifts out of its owning source', () => {
    const root = makeFixture();
    const target = path.join(root, 'webpack', 'production.js');
    fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('\'/objects\'', '\'/objects-removed\''));

    expect(() => runChecker(root)).toThrow(/productionNavigationExclusions value "\/objects"/);
  });

  it('fails when the production suffix exclusion drifts', () => {
    const root = makeFixture();
    const target = path.join(root, 'webpack', 'production.js');
    fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('endsWith(\'/embed\')', 'endsWith(\'/embed-removed\')'));

    expect(() => runChecker(root)).toThrow(/productionNavigationSuffixExclusions value "\/embed"/);
  });
});
