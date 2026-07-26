'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { scanPresentationBoundaries } = require('./architecture-boundary-lib');

const root = path.resolve(process.env.ARCHITECTURE_BOUNDARY_ROOT || path.resolve(__dirname, '..'));
const inventoryPath = path.join(root, 'config', 'architecture-boundary-inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

if (inventory.schemaVersion !== 1) throw new Error(`architecture-boundary: unsupported schemaVersion ${inventory.schemaVersion}`);
for (const field of ['status', 'owner', 'scope', 'removalTarget']) {
  if (typeof inventory[field] !== 'string' || !inventory[field]) {
    throw new Error(`architecture-boundary: missing ${field}`);
  }
}
if (!Array.isArray(inventory.findings)) throw new Error('architecture-boundary: findings must be an array');

const actual = scanPresentationBoundaries(root);
if (JSON.stringify(actual) !== JSON.stringify(inventory.findings)) {
  const expectedKeys = new Set(inventory.findings.map(finding => JSON.stringify(finding)));
  const actualKeys = new Set(actual.map(finding => JSON.stringify(finding)));
  const added = actual.filter(finding => !expectedKeys.has(JSON.stringify(finding)));
  const removed = inventory.findings.filter(finding => !actualKeys.has(JSON.stringify(finding)));
  throw new Error(`architecture-boundary: presentation dependency drift; added=${JSON.stringify(added)} removed=${JSON.stringify(removed)}`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: inventory.schemaVersion,
  status: inventory.status,
  legacyFindings: actual.length,
}, null, 2)}\n`);
