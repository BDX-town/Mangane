'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { buildHtmlSafetyManifest } = require('./html-safety-inventory-lib');

const root = path.resolve(process.env.HTML_SAFETY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'html-safety-authority-inventory.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const expected = buildHtmlSafetyManifest(root);

assert.deepStrictEqual(manifest, expected, 'HTML safety authority manifest drifted; regenerate and reconcile it');
assert.equal(manifest.sanitizer.declaredVersion, '3.4.12', 'DOMPurify must remain exactly pinned for sanitizer regression review');
assert.ok(manifest.callsites.length > 0, 'HTML safety inventory must not be empty');

const unverified = manifest.callsites.filter(callsite =>
  ['react-html-sink', 'dom-html-write', 'html-parser', 'iframe-sink'].includes(callsite.kind)
  && callsite.classification === 'unverified',
);
assert.deepStrictEqual(unverified, [], `Unverified HTML execution surfaces: ${unverified.map(callsite => callsite.id).join(', ')}`);

const htmlSinks = manifest.callsites.filter(callsite => callsite.kind === 'react-html-sink');
assert.ok(htmlSinks.length >= 40, 'HTML sink count shrank unexpectedly; reconcile intentional removals in the checker');
assert.ok(htmlSinks.every(callsite => callsite.classification !== 'unverified'), 'Every React HTML sink must be sanitized or use a sanitizing wrapper');

const dynamicDestinations = manifest.callsites.filter(callsite => callsite.kind === 'dynamic-link-destination');
assert.ok(dynamicDestinations.length > 0, 'Dynamic destination inventory must not be empty');
assert.ok(
  dynamicDestinations.every(callsite => callsite.classification === 'central-navigation-policy'),
  'Every dynamic native-link destination must be governed by the central navigation policy',
);
assert.equal(
  manifest.invariants.allDynamicDestinationsRuntimeGoverned,
  true,
  'Dynamic destination runtime-governance invariant must remain enabled',
);

const source = fs.readFileSync(path.join(root, manifest.sanitizer.policyModule), 'utf8');
for (const requiredFragment of [
  'import DOMPurify from \'dompurify\';',
  'USE_PROFILES: { html: true }',
  'FORBID_TAGS: FORBIDDEN_TAGS',
  'FORBID_ATTR: FORBIDDEN_ATTRIBUTES',
  '  \'style\',\n  \'svg\',',
  '  \'srcset\',\n  \'style\',\n  \'xlink:href\',',
  'sanitizeUrl(data.attrValue, purpose)',
  'node.setAttribute(\'rel\', \'nofollow noopener noreferrer ugc\')',
]) {
  assert.ok(source.includes(requiredFragment), `Sanitizer policy evidence missing: ${requiredFragment}`);
}

const embedSource = fs.readFileSync(path.join(root, 'app/soapbox/features/ui/components/embed_modal.tsx'), 'utf8');
assert.ok(embedSource.includes('sandbox=\'\''), 'oEmbed preview iframe must retain an empty sandbox');
assert.ok(embedSource.includes('srcDoc={previewHtml}'), 'oEmbed preview must use sanitized srcDoc');
assert.ok(!embedSource.includes('.write('), 'oEmbed preview must not use document.write');

const navigationPolicySource = fs.readFileSync(path.join(root, 'app/soapbox/utils/navigation-policy.ts'), 'utf8');
for (const requiredFragment of [
  'import { sanitizeUrl } from \'./url-policy\';',
  'document.addEventListener(\'click\', guardNavigation, true)',
  'document.addEventListener(\'auxclick\', guardNavigation, true)',
  'new MutationObserver(',
  'attributeFilter: [\'href\', \'rel\', \'target\']',
  'anchor.removeAttribute(\'href\')',
]) {
  assert.ok(navigationPolicySource.includes(requiredFragment), `Navigation policy evidence missing: ${requiredFragment}`);
}

const mainSource = fs.readFileSync(path.join(root, 'app/soapbox/main.tsx'), 'utf8');
assert.ok(
  mainSource.includes('import { installNavigationPolicy } from \'soapbox/utils/navigation-policy\';'),
  'Application startup must import the navigation policy',
);
assert.ok(mainSource.includes('installNavigationPolicy();'), 'Application startup must install the navigation policy');

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedCallsites: manifest.callsites.length,
  counts: manifest.counts,
  sanitizer: manifest.sanitizer.declaredVersion,
}, null, 2)}\n`);
