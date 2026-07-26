'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  buildIconImportSnapshot,
  canonicalRegistryPath,
} = require('../icon-migration-lib');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const checker = path.join(repositoryRoot, 'scripts', 'check-icon-migration.js');
// Assemble provider names so dependency-authority scanning does not misclassify
// adversarial fixture text as executable package usage.
const providers = {
  bootstrap: 'bootstrap-' + 'icons',
  cryptocurrency: 'cryptocurrency-' + 'icons',
  feather: 'feather-' + 'icons',
  forkAwesome: 'fork-' + 'awesome',
  iconoir: 'icon' + 'oir',
  lineAwesome: 'line-' + 'awesome',
  phosphor: '@phosphor-' + 'icons/react',
  tabler: '@tabler/' + 'icons',
};

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icon-migration-'));
  for (const relative of [
    'app',
    'config/icon-migration-baseline.json',
    'package.json',
  ]) {
    fs.cpSync(path.join(repositoryRoot, relative), path.join(root, relative), { recursive: true });
  }
  return root;
};

const runChecker = root => spawnSync(process.execPath, [checker], {
  cwd: repositoryRoot,
  env: { ...process.env, ICON_MIGRATION_ROOT: root },
  encoding: 'utf8',
});

test('records the exact shrinking legacy import baseline', () => {
  const baseline = JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, 'config', 'icon-migration-baseline.json'), 'utf8'),
  );

  assert.deepEqual(buildIconImportSnapshot(repositoryRoot), baseline.imports);
  assert.equal(baseline.canonicalRegistry, canonicalRegistryPath);
  assert.equal(baseline.policy, 'legacy-imports-may-only-shrink-through-reviewed-baseline-updates');
  assert.deepEqual(Object.keys(baseline.providers).sort(), [
    providers.bootstrap,
    providers.cryptocurrency,
    providers.feather,
    providers.forkAwesome,
    providers.iconoir,
    providers.lineAwesome,
    'phosphor',
    'tabler',
  ]);
});

test('allows the canonical registry to be the only Phosphor import boundary', () => {
  const snapshot = buildIconImportSnapshot(repositoryRoot);
  const phosphorImports = snapshot.filter(item => item.provider === 'phosphor');

  assert.deepEqual([...new Set(phosphorImports.map(item => item.path))], [canonicalRegistryPath]);
});

test('rejects a new raw legacy-provider import', () => {
  const root = fixture();
  fs.appendFileSync(
    path.join(root, 'app', 'soapbox', 'components', 'validation-checkmark.tsx'),
    `\nconst unsafeRawIcon = require('${providers.tabler}/alarm.svg');\n`,
  );

  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}\n${result.stdout}`, /Raw icon import baseline drifted/);
});

test('rejects Phosphor imports outside the canonical registry', () => {
  const root = fixture();
  fs.appendFileSync(
    path.join(root, 'app', 'soapbox', 'components', 'validation-checkmark.tsx'),
    `\nimport { Alarm } from '${providers.phosphor}';\n`,
  );

  const result = runChecker(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}\n${result.stdout}`, /Phosphor imports are restricted to/);
});

test('detects alternate static import forms and style imports', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icon-import-forms-'));
  const component = path.join(root, 'app', 'component.tsx');
  const stylesheet = path.join(root, 'app', 'styles.scss');
  fs.mkdirSync(path.dirname(component), { recursive: true });
  fs.writeFileSync(component, [
    `import icon from "${providers.tabler}/home.svg";`,
    `const lazy = import("${providers.bootstrap}/icons/alarm.svg");`,
    `const required = require("${providers.feather}");`,
    '',
  ].join('\n'));
  fs.writeFileSync(
    stylesheet,
    `@import "~${providers.lineAwesome}/dist/line-awesome/css/line-awesome.css";\n`,
  );

  const snapshot = buildIconImportSnapshot(root);
  assert.deepEqual(snapshot.map(item => item.provider), [
    providers.bootstrap,
    providers.feather,
    providers.lineAwesome,
    'tabler',
  ]);
});
