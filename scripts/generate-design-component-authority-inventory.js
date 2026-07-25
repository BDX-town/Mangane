'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { buildDesignInventory } = require('./design-inventory-lib');

const root = path.resolve(__dirname, '..');
const manifest = buildDesignInventory(root);
fs.writeFileSync(path.join(root, 'config/design-component-authority-inventory.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'config/component-ownership-manifest.json'), `${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  components: Object.fromEntries(manifest.components.map(component => [component.path, component.owner])),
  owners: manifest.counts.owners,
}, null, 2)}\n`);
process.stdout.write(`Recorded ${manifest.components.length} components, ${manifest.styles.length} styles, ${manifest.icons.length} icon callsites, and ${Object.values(manifest.counts.behaviors).reduce((a, b) => a + b, 0)} behavior callsites.\n`);
