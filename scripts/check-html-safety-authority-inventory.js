'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.HTML_SAFETY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'html-safety-authority-inventory.json');
const fail = message => { throw new Error(`html-safety-authority: ${message}`); };

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (!Array.isArray(manifest.surfaces) || manifest.surfaces.length === 0) fail('surfaces must be a non-empty array');
if (!Array.isArray(manifest.requiredSurfaceIds) || manifest.requiredSurfaceIds.length === 0) fail('requiredSurfaceIds must be a non-empty array');
if (!Array.isArray(manifest.explicitUnknowns) || manifest.explicitUnknowns.length === 0) fail('explicitUnknowns must be a non-empty array');

const expectedUnknowns = [
  'Repository-wide production dangerouslySetInnerHTML and innerHTML enumeration remains incomplete.',
  'Sanitizer package, version, configuration and provenance for status content and spoiler HTML are not verified.',
  'Allowed tags, attributes, URI schemes, SVG, MathML, CSS, iframe and custom-element behavior are not proven.',
  'Caller and downstream-sink inventories for unescapeHTML and stripCompatibilityFeatures remain incomplete.',
];
if (new Set(manifest.explicitUnknowns).size !== manifest.explicitUnknowns.length) fail('explicitUnknowns must not contain duplicates');
for (const unknown of expectedUnknowns) {
  if (!manifest.explicitUnknowns.includes(unknown)) fail(`required explicit unknown is missing: ${unknown}`);
}
if (manifest.explicitUnknowns.length !== expectedUnknowns.length) fail('explicitUnknowns changed without reconciliation');

const seenIds = new Set();
for (const surface of manifest.surfaces) {
  if (!surface || typeof surface.id !== 'string' || typeof surface.path !== 'string') fail('every surface requires id and path');
  if (seenIds.has(surface.id)) fail(`duplicate surface id ${surface.id}`);
  seenIds.add(surface.id);
  if (surface.sanitizerVerified !== false) fail(`${surface.id} must not claim verified sanitization`);
  if (!Array.isArray(surface.requiredFragments) || surface.requiredFragments.length === 0) fail(`${surface.id} requires evidence fragments`);

  const absolute = path.resolve(root, surface.path);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe source path ${surface.path}`);
  const source = fs.readFileSync(absolute, 'utf8');
  for (const fragment of surface.requiredFragments) {
    if (typeof fragment !== 'string' || fragment.length < 3) fail(`${surface.id} contains an invalid evidence fragment`);
    if (!source.includes(fragment)) fail(`${surface.path} no longer contains evidence for ${surface.id}: ${fragment}`);
  }
}

for (const requiredId of manifest.requiredSurfaceIds) {
  if (!seenIds.has(requiredId)) fail(`required HTML safety surface ${requiredId} is missing`);
}
if (seenIds.size !== manifest.requiredSurfaceIds.length) fail('surface set changed without requiredSurfaceIds reconciliation');

for (const invariant of [
  'transformersMustNotBeClassifiedAsSanitizers',
  'statusHtmlSanitizerProvenanceRemainsBlocked',
  'postInsertionLinkMutationIsNotSanitization',
  'explicitUnknownsRemainPinned',
]) {
  if (manifest.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedSurfaces: manifest.surfaces.length,
  surfaceIds: [...seenIds],
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
