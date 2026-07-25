'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const checker = path.join(repositoryRoot, 'scripts', 'check-html-safety-authority-inventory.js');

const copyRepository = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mangane-html-safety-'));
  fs.cpSync(path.join(repositoryRoot, 'app'), path.join(root, 'app'), { recursive: true });
  fs.cpSync(path.join(repositoryRoot, 'config', 'html-safety-authority-inventory.json'), path.join(root, 'config', 'html-safety-authority-inventory.json'));
  fs.cpSync(path.join(repositoryRoot, 'package.json'), path.join(root, 'package.json'));
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  fs.cpSync(path.join(repositoryRoot, 'scripts', 'html-safety-inventory-lib.js'), path.join(root, 'scripts', 'html-safety-inventory-lib.js'));
  return root;
};

const run = root => spawnSync(process.execPath, [checker], {
  cwd: repositoryRoot,
  env: { ...process.env, HTML_SAFETY_INVENTORY_ROOT: root },
  encoding: 'utf8',
});

test('verifies the complete Phase 0D HTML safety inventory', () => {
  const result = run(repositoryRoot);
  assert.equal(result.status, 0, result.stderr);
});

test('fails when an ungoverned HTML sink is added', () => {
  const root = copyRepository();
  const target = path.join(root, 'app', 'soapbox', 'unsafe-phase-0d.tsx');
  fs.writeFileSync(target, 'export const Unsafe = ({ html }) => <div dangerouslySetInnerHTML={{ __html: html }} />;\n');
  const result = run(root);
  assert.notEqual(result.status, 0);
});

test('fails when a dangerous DOM write is added', () => {
  const root = copyRepository();
  const target = path.join(root, 'app', 'soapbox', 'unsafe-dom-write.ts');
  fs.writeFileSync(target, 'export const write = (node, html) => { node.innerHTML = html; };\n');
  const result = run(root);
  assert.notEqual(result.status, 0);
});

test('fails when the sanitizer policy drifts', () => {
  const root = copyRepository();
  const target = path.join(root, 'app', 'soapbox', 'utils', 'html-safety.ts');
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('\'style\',', ''));
  const result = run(root);
  assert.notEqual(result.status, 0);
});

test('fails when raw preview document.write returns', () => {
  const root = copyRepository();
  const target = path.join(root, 'app', 'soapbox', 'features', 'ui', 'components', 'embed_modal.tsx');
  fs.appendFileSync(target, '\n// iframeDocument.write(remoteHtml)\n');
  const result = run(root);
  assert.notEqual(result.status, 0);
});

test('fails when central native-link enforcement is removed', () => {
  const root = copyRepository();
  const target = path.join(root, 'app', 'soapbox', 'main.tsx');
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('installNavigationPolicy();', ''));
  const result = run(root);
  assert.notEqual(result.status, 0);
});

test('fails when navigation event capture is weakened', () => {
  const root = copyRepository();
  const target = path.join(root, 'app', 'soapbox', 'utils', 'navigation-policy.ts');
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace(
    'document.addEventListener(\'click\', guardNavigation, true)',
    'document.addEventListener(\'click\', guardNavigation)',
  ));
  const result = run(root);
  assert.notEqual(result.status, 0);
});
