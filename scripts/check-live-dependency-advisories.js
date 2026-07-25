#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const {
  advisoryKey,
  parseAuditJsonLines,
} = require('./dependency-inventory-lib');

const root = path.resolve(process.env.DEPENDENCY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const auditFile = process.argv[2];
if (!auditFile) throw new Error('usage: node scripts/check-live-dependency-advisories.js <yarn-audit.jsonl>');

const committed = require(path.join(root, 'config', 'dependency-advisory-snapshot.json')).advisories;
const live = parseAuditJsonLines(path.resolve(auditFile));
const committedKeys = committed.map(advisoryKey).sort();
const liveKeys = live.map(advisoryKey).sort();

if (JSON.stringify(committedKeys) !== JSON.stringify(liveKeys)) {
  const committedSet = new Set(committedKeys);
  const liveSet = new Set(liveKeys);
  const added = liveKeys.filter(key => !committedSet.has(key));
  const removed = committedKeys.filter(key => !liveSet.has(key));
  throw new Error(`dependency-advisory-drift: live npm advisory results changed\nadded: ${added.join(', ') || 'none'}\nremoved: ${removed.join(', ') || 'none'}`);
}

fs.accessSync(auditFile, fs.constants.R_OK);
process.stdout.write(`${JSON.stringify({ checkedAdvisories: live.length, drift: false }, null, 2)}\n`);
