'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repositoryRoot, 'scripts', 'check-html-safety-authority-inventory.js');
const run = (root = repositoryRoot) => execFileSync(process.execPath, [script], {
  cwd: root,
  env: { ...process.env, HTML_SAFETY_INVENTORY_ROOT: root },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'html-safety-authority-'));
  for (const relativePath of [
    'config/html-safety-authority-inventory.json',
    'app/soapbox/components/status_content.tsx',
    'app/soapbox/utils/html.ts',
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

const mutateManifest = (root, transform) => mutate(root, 'config/html-safety-authority-inventory.json', source => {
  const manifest = JSON.parse(source);
  transform(manifest);
  return `${JSON.stringify(manifest, null, 2)}\n`;
});

const assertRunFails = (root, pattern) => {
  assert.throws(() => run(root), error => pattern.test(`${error.stderr || ''}\n${error.message || ''}`));
};

test('verifies the bounded current HTML safety inventory', () => {
  const report = JSON.parse(run());
  assert.equal(report.checkedSurfaces, 4);
  assert.equal(report.explicitUnknowns, 4);
});

test('fails when the status body sink drifts without reconciliation', () => {
  const root = fixture();
  mutate(root, 'app/soapbox/components/status_content.tsx', source => source.replace('dangerouslySetInnerHTML={content}', 'children={parsedHtml}'));
  assertRunFails(root, /status-body-html-sink/);
});

test('fails when sanitizer verification is asserted', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces.find(surface => surface.id === 'compatibility-html-transformer').sanitizerVerified = true;
  });
  assertRunFails(root, /must not claim verified sanitization/);
});

test('fails when a transformer classification becomes sanitizer-like', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces.find(surface => surface.id === 'compatibility-html-transformer').classification = 'verified-html-sanitizer';
  });
  assertRunFails(root, /classification changed without checker reconciliation/);
});

test('fails when a required surface is removed', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces = manifest.surfaces.filter(surface => surface.id !== 'status-spoiler-html-sink');
  });
  assertRunFails(root, /required HTML safety surface status-spoiler-html-sink/);
});

test('fails when a surface and the manifest required-id list shrink together', () => {
  const root = fixture();
  mutateManifest(root, manifest => {
    manifest.surfaces = manifest.surfaces.filter(surface => surface.id !== 'status-spoiler-html-sink');
    manifest.requiredSurfaceIds = manifest.requiredSurfaceIds.filter(id => id !== 'status-spoiler-html-sink');
  });
  assertRunFails(root, /externally pinned required surface status-spoiler-html-sink/);
});

test('fails when explicit unknowns silently shrink', () => {
  const root = fixture();
  mutateManifest(root, manifest => { manifest.explicitUnknowns.pop(); });
  assertRunFails(root, /required explicit unknown is missing|explicitUnknowns changed/);
});

test('rejects source paths escaping the repository root', () => {
  const root = fixture();
  mutateManifest(root, manifest => { manifest.surfaces[0].path = '../outside.tsx'; });
  assertRunFails(root, /unsafe source path/);
});