'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { buildTelemetryManifest } = require('./telemetry-inventory-lib');

const root = path.resolve(process.env.SENTRY_AUTHORITY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const target = path.join(root, 'config', 'sentry-authority-inventory.json');
fs.writeFileSync(target, `${JSON.stringify(buildTelemetryManifest(root), null, 2)}\n`);
process.stdout.write(`${target}\n`);
