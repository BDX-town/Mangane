'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  buildIconImportSnapshot,
  canonicalRegistryPath,
  summarizeProviders,
} = require('./icon-migration-lib');

const root = path.resolve(process.env.ICON_MIGRATION_ROOT || path.resolve(__dirname, '..'));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const baseline = JSON.parse(read('config/icon-migration-baseline.json'));
const imports = buildIconImportSnapshot(root);
const packageJson = JSON.parse(read('package.json'));
const phosphorImports = imports.filter(item => item.provider === 'phosphor');

assert.equal(baseline.schemaVersion, 1, 'Unsupported icon migration baseline schema');
assert.equal(baseline.canonicalRegistry, canonicalRegistryPath, 'Canonical semantic icon registry drifted');
assert.equal(
  baseline.policy,
  'legacy-imports-may-only-shrink-through-reviewed-baseline-updates',
  'Raw icon import policy drifted',
);
assert.ok(
  phosphorImports.length > 0,
  'The canonical semantic icon registry must import Phosphor',
);
assert.deepStrictEqual(
  [...new Set(phosphorImports.map(item => item.path))],
  [canonicalRegistryPath],
  `Phosphor imports are restricted to ${canonicalRegistryPath}`,
);
assert.deepStrictEqual(
  imports,
  baseline.imports,
  'Raw icon import baseline drifted; new raw imports are forbidden and migrations require reviewed baseline reconciliation',
);
assert.deepStrictEqual(
  summarizeProviders(imports),
  baseline.providers,
  'Icon provider counts drifted from the reviewed migration baseline',
);
assert.equal(
  packageJson.dependencies?.['@phosphor-icons/react'],
  '2.1.10',
  'Pin the reviewed Phosphor dependency exactly to 2.1.10',
);

process.stdout.write(`${JSON.stringify({
  canonicalRegistry: canonicalRegistryPath,
  providers: baseline.providers,
}, null, 2)}\n`);
