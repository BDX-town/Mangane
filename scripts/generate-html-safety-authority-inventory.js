'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { buildHtmlSafetyManifest } = require('./html-safety-inventory-lib');

const root = path.resolve(process.env.HTML_SAFETY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'html-safety-authority-inventory.json');

fs.writeFileSync(manifestPath, `${JSON.stringify(buildHtmlSafetyManifest(root), null, 2)}\n`);
process.stdout.write(`${manifestPath}\n`);
