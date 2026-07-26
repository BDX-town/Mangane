'use strict';

const fs = require('node:fs');
const path = require('node:path');

const {
  buildIconImportSnapshot,
  canonicalRegistryPath,
  summarizeProviders,
} = require('./icon-migration-lib');

const root = path.resolve(process.env.ICON_MIGRATION_ROOT || path.resolve(__dirname, '..'));
const imports = buildIconImportSnapshot(root);
const baseline = {
  schemaVersion: 1,
  status: 'phase-2b-in-progress',
  policy: 'legacy-imports-may-only-shrink-through-reviewed-baseline-updates',
  canonicalRegistry: canonicalRegistryPath,
  providers: summarizeProviders(imports),
  imports,
};
const destination = path.join(root, 'config', 'icon-migration-baseline.json');

fs.writeFileSync(destination, `${JSON.stringify(baseline, null, 2)}\n`);
process.stdout.write(`${path.relative(root, destination)}\n`);
