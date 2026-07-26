'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const checker = path.join(repositoryRoot, 'scripts', 'check-design-component-authority-inventory.js');
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'design-authority-'));
  for (const relative of ['app/soapbox', 'app/styles', 'config/design-component-authority-inventory.json', 'config/component-ownership-manifest.json', 'config/design-tokens.json', 'config/icon-migration-baseline.json', 'docs/architecture', 'tailwind.config.js', 'tailwind']) {
    fs.cpSync(path.join(repositoryRoot, relative), path.join(root, relative), { recursive: true });
  }
  return root;
};
const run = root => spawnSync(process.execPath, [checker], {
  cwd: repositoryRoot,
  env: { ...process.env, DESIGN_AUTHORITY_INVENTORY_ROOT: root },
  encoding: 'utf8',
});
const fails = (root, pattern) => {
  const result = run(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}\n${result.stdout}`, pattern);
};

test('verifies the complete Phase 0F design and accessibility authority', () => {
  const result = run(repositoryRoot);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(JSON.parse(result.stdout).components >= 300);
});

test('fails when a component lands without ownership reconciliation', () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, 'app/soapbox/components/unclassified.tsx'), 'export const Unclassified = () => <button>New</button>;\n');
  fails(root, /manifest drifted/);
});

test('fails when a style entry lands without classification', () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, 'app/styles/unclassified.scss'), '.new-style { color: red; }\n');
  fails(root, /manifest drifted/);
});

test('fails when an icon import has no reviewed disposition', () => {
  const root = fixture();
  fs.appendFileSync(path.join(root, 'app/soapbox/components/icon.tsx'), '\nconst newIcon = require(\'@tabler/icons/alarm.svg\');\n');
  fails(root, /manifest drifted/);
});

test('fails when Phosphor bypasses the canonical semantic registry', () => {
  const root = fixture();
  fs.appendFileSync(path.join(root, 'app/soapbox/components/icon.tsx'), '\nimport { AlarmIcon } from \'@phosphor-icons/react/Alarm\';\n');
  fails(root, /manifest drifted|Raw Phosphor imports/);
});

test('fails when keyboard or focus behavior drifts', () => {
  const root = fixture();
  fs.appendFileSync(path.join(root, 'app/soapbox/components/ui/button/button.tsx'), '\nconst focusBehavior = () => document.body.focus();\n');
  fails(root, /manifest drifted/);
});

test('fails when the reduced-motion baseline is removed', () => {
  const root = fixture();
  const target = path.join(root, 'app/styles/accessibility.scss');
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('prefers-reduced-motion: reduce', 'motion-is-always-enabled'));
  fails(root, /manifest drifted|Reduced-motion baseline/);
});

test('fails when Framework7 enters without migration review', () => {
  const root = fixture();
  fs.appendFileSync(path.join(root, 'app/soapbox/components/ui/button/button.tsx'), '\nimport Framework7 from \'framework7\';\n');
  fails(root, /manifest drifted|Framework7/);
});
