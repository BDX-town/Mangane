'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { scanPresentationBoundaries } = require('./architecture-boundary-lib');

const root = path.resolve(__dirname, '..');
const target = path.join(root, 'config', 'architecture-boundary-inventory.json');
const findings = scanPresentationBoundaries(root);
const inventory = {
  schemaVersion: 1,
  status: 'legacy-presentation-debt-drift-gated',
  owner: 'architecture-maintainers',
  scope: 'Presentation source may not add direct transport, backend-feature, or endpoint dependencies.',
  removalTarget: 'Phase 7',
  findings,
};

fs.writeFileSync(target, `${JSON.stringify(inventory, null, 2)}\n`);
process.stdout.write(`Generated ${path.relative(root, target)} with ${findings.length} legacy findings.\n`);
