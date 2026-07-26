'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const checker = path.join(repositoryRoot, 'scripts', 'check-dependency-authority-inventory.js');
const liveChecker = path.join(repositoryRoot, 'scripts', 'check-live-dependency-advisories.js');

const copyDirectory = (source, destination) => {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else fs.copyFileSync(from, to);
  }
};

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dependency-authority-'));
  for (const relativePath of [
    'package.json',
    'yarn.lock',
    'scripts/download-twemoji-assets.js',
    'config/dependency-authority-inventory.json',
    'config/dependency-advisory-snapshot.json',
  ]) {
    const destination = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(repositoryRoot, relativePath), destination);
  }
  copyDirectory(path.join(repositoryRoot, '.github', 'workflows'), path.join(root, '.github', 'workflows'));
  return root;
};

const run = (root = repositoryRoot) => execFileSync(process.execPath, [checker], {
  cwd: root,
  env: { ...process.env, DEPENDENCY_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const mutateJson = (root, relativePath, transform) => {
  const target = path.join(root, relativePath);
  const value = JSON.parse(fs.readFileSync(target, 'utf8'));
  transform(value);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
};

const assertRunFails = (root, pattern) => {
  assert.throws(() => run(root), error => pattern.test(`${error.stderr || ''}\n${error.message || ''}`));
};

test('verifies every resolved package and high/critical disposition', () => {
  const report = JSON.parse(run());
  assert.equal(report.resolvedPackages, 2034);
  assert.equal(report.directPackages, 209);
  assert.equal(report.highOrCriticalAdvisories, 54);
  assert.ok(report.actionUses > 0);
});

test('fails when package.json changes without inventory reconciliation', () => {
  const root = fixture();
  mutateJson(root, 'package.json', manifest => {
    manifest.description = 'unreconciled drift';
  });
  assertRunFails(root, /package\.json drifted/);
});

test('fails when a resolved lockfile package is omitted', () => {
  const root = fixture();
  mutateJson(root, 'config/dependency-authority-inventory.json', inventory => {
    inventory.packages.pop();
  });
  assertRunFails(root, /resolved package set drifted/);
});

test('fails when license metadata silently disappears', () => {
  const root = fixture();
  mutateJson(root, 'config/dependency-authority-inventory.json', inventory => {
    inventory.packages[0].license.expression = 'NOASSERTION';
  });
  assertRunFails(root, /unresolved license metadata/);
});

test('fails when license obligations silently disappear', () => {
  const root = fixture();
  mutateJson(root, 'config/dependency-authority-inventory.json', inventory => {
    inventory.packages[0].license.obligations = [];
  });
  assertRunFails(root, /no license obligation record/);
});

test('fails when duplicate package evidence is silently removed', () => {
  const root = fixture();
  mutateJson(root, 'config/dependency-authority-inventory.json', inventory => {
    inventory.duplicatePackages.pop();
  });
  assertRunFails(root, /duplicate package register drifted/);
});

test('fails when the networked postinstall downloader changes without review', () => {
  const root = fixture();
  fs.appendFileSync(path.join(root, 'scripts', 'download-twemoji-assets.js'), '\n// unreconciled fixture drift\n');
  assertRunFails(root, /postinstall downloader drifted/);
});

test('fails when a Twemoji download hardening control is removed', () => {
  const root = fixture();
  mutateJson(root, 'config/dependency-authority-inventory.json', inventory => {
    inventory.repositorySupplyChain.postinstall.integrityVerification = false;
  });
  assertRunFails(root, /download hardening drifted/);
});

test('fails when a high advisory loses its reachability disposition', () => {
  const root = fixture();
  mutateJson(root, 'config/dependency-authority-inventory.json', inventory => {
    const advisory = inventory.advisories.find(row => row.severity === 'high');
    advisory.disposition = { status: 'tracked-below-high-threshold' };
  });
  assertRunFails(root, /lacks a high\/critical disposition/);
});

test('fails when a high advisory loses its resolved root path', () => {
  const root = fixture();
  mutateJson(root, 'config/dependency-authority-inventory.json', inventory => {
    const advisory = inventory.advisories.find(row => row.severity === 'high');
    advisory.disposition.rootDependencies = [];
  });
  assertRunFails(root, /lacks resolved locator or root-dependency reachability/);
});

test('fails when a workflow action use drifts without review', () => {
  const root = fixture();
  const workflow = path.join(root, '.github', 'workflows', 'webpack.yml');
  fs.appendFileSync(workflow, '\n  # unreconciled action\n  # - uses: example/action@v1\n');
  fs.appendFileSync(workflow, '\n  # inventory fixture follows\n  - uses: example/action@v1\n');
  assertRunFails(root, /GitHub Actions use sites drifted/);
});

test('accepts the committed advisory set and rejects live advisory drift', () => {
  const root = fixture();
  const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'config', 'dependency-advisory-snapshot.json'), 'utf8'));
  const auditFile = path.join(root, 'audit.jsonl');
  const toYarnRow = advisory => JSON.stringify({
    value: advisory.package,
    children: {
      ID: advisory.advisoryId,
      Issue: advisory.issue,
      URL: advisory.url,
      Severity: advisory.severity,
      'Vulnerable Versions': advisory.vulnerableVersions,
      'Tree Versions': advisory.treeVersions,
      Dependents: advisory.dependents,
    },
  });
  fs.writeFileSync(auditFile, `${snapshot.advisories.map(toYarnRow).join('\n')}\n`);
  const output = execFileSync(process.execPath, [liveChecker, auditFile], {
    cwd: root,
    env: { ...process.env, DEPENDENCY_INVENTORY_ROOT: root },
    encoding: 'utf8',
  });
  assert.equal(JSON.parse(output).drift, false);

  fs.appendFileSync(auditFile, `${toYarnRow({
    advisoryId: 'GHSA-test-drift',
    dependents: ['mangane-fe@workspace:.'],
    issue: 'fixture',
    package: 'fixture-package',
    severity: 'high',
    treeVersions: ['1.0.0'],
    url: null,
    vulnerableVersions: '1.0.0',
  })}\n`);
  assert.throws(
    () => execFileSync(process.execPath, [liveChecker, auditFile], {
      cwd: root,
      env: { ...process.env, DEPENDENCY_INVENTORY_ROOT: root },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
    /dependency-advisory-drift/,
  );
});
