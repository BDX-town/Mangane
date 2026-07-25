'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { buildDesignInventory } = require('./design-inventory-lib');

const root = path.resolve(process.env.DESIGN_AUTHORITY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const manifest = JSON.parse(read('config/design-component-authority-inventory.json'));
const expected = buildDesignInventory(root);
assert.deepStrictEqual(manifest, expected, 'Design/component authority manifest drifted; regenerate and reconcile it');

const ownership = JSON.parse(read('config/component-ownership-manifest.json'));
assert.deepStrictEqual(
  ownership.components,
  Object.fromEntries(manifest.components.map(component => [component.path, component.owner])),
  'Component ownership manifest drifted',
);
assert.deepStrictEqual(ownership.owners, manifest.counts.owners, 'Component owner counts drifted');
assert.ok(manifest.components.length >= 300, 'Component discovery unexpectedly fell below its reviewed baseline');
assert.ok(manifest.styles.length >= 70, 'Style discovery unexpectedly fell below its reviewed baseline');
assert.ok(manifest.icons.length >= 100, 'Icon discovery unexpectedly fell below its reviewed baseline');
assert.ok(manifest.components.every(item => item.owner && item.classifications.length), 'Every component must have an owner and classification');
assert.ok(manifest.styles.every(item => item.authority && item.disposition), 'Every style entry must have an authority and disposition');
assert.ok(manifest.icons.every(item => item.provider && item.disposition), 'Every icon callsite must have a provider and disposition');
assert.ok((manifest.counts.behaviors.keyboard || 0) > 0, 'Keyboard behavior inventory must not be empty');
assert.ok((manifest.counts.behaviors.gesture || 0) > 0, 'Gesture behavior inventory must not be empty');
assert.ok((manifest.counts.behaviors.focus || 0) > 0, 'Focus behavior inventory must not be empty');
assert.ok((manifest.counts.behaviors['live-region'] || 0) > 0, 'Live-region inventory must not be empty');
assert.deepStrictEqual(manifest.framework7.currentImports, [], 'Framework7 imports require explicit compatibility and accessibility classification');

const reducedMotion = read('app/styles/accessibility.scss');
for (const evidence of ['prefers-reduced-motion: reduce', 'animation-duration: 0.01ms', 'transition-duration: 0.01ms', 'scroll-behavior: auto']) {
  assert.ok(reducedMotion.includes(evidence), `Reduced-motion baseline missing: ${evidence}`);
}
const applicationStyles = read('app/styles/application.scss');
assert.ok(applicationStyles.includes('@import \'accessibility\';'), 'The reduced-motion policy must remain in the global style graph');
const notificationRegion = read('app/soapbox/features/ui/containers/notifications_container.tsx');
for (const evidence of ['role=\'region\'', 'aria-live=\'assertive\'', 'aria-atomic=\'false\'', 'notifications.live_region.label']) {
  assert.ok(notificationRegion.includes(evidence), `Notification live-region baseline missing: ${evidence}`);
}
const tailwind = read('tailwind.config.js');
for (const [name, value] of Object.entries(manifest.baselines.breakpoints)) {
  assert.ok(tailwind.includes(`${name}: '${value}'`), `Breakpoint authority drifted: ${name}`);
}
for (const document of [
  'docs/architecture/DESIGN_AND_COMPONENT_INVENTORY.md',
  'docs/architecture/ICON_MIGRATION_MATRIX.md',
  'docs/architecture/STYLE_AND_TOKEN_SOURCE_MAP.md',
  'docs/architecture/KEYBOARD_AND_GESTURE_INVENTORY.md',
  'docs/architecture/ACCESSIBILITY_BEHAVIOR_MATRIX.md',
  'docs/architecture/SCREENSHOT_AND_INTERACTION_BASELINE_PLAN.md',
]) assert.ok(fs.existsSync(path.join(root, document)), `Required Phase 0F artifact missing: ${document}`);

process.stdout.write(`${JSON.stringify(manifest.counts, null, 2)}\n`);
