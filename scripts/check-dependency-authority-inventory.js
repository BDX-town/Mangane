#!/usr/bin/env node
'use strict';

const path = require('node:path');

const {
  validateInventory,
} = require('./dependency-inventory-lib');

const root = path.resolve(process.env.DEPENDENCY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const inventory = require(path.join(root, 'config', 'dependency-authority-inventory.json'));
const auditSnapshot = require(path.join(root, 'config', 'dependency-advisory-snapshot.json'));
if (auditSnapshot.schemaVersion !== 1 || !Array.isArray(auditSnapshot.advisories)) {
  throw new Error('dependency-authority: invalid advisory snapshot schema');
}

const errors = validateInventory({
  root,
  inventory,
  auditSnapshot: auditSnapshot.advisories,
});
if (errors.length) {
  throw new Error(`dependency-authority:\n- ${errors.join('\n- ')}`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: inventory.schemaVersion,
  status: inventory.status,
  resolvedPackages: inventory.packages.length,
  directPackages: inventory.packages.filter(pkg => pkg.direct).length,
  highOrCriticalAdvisories: inventory.advisories.filter(row => ['high', 'critical'].includes(row.severity)).length,
  actionUses: inventory.githubActions.length,
  unpinnedActionUses: inventory.githubActions.filter(row => !row.pinnedToCommit).length,
}, null, 2)}\n`);
