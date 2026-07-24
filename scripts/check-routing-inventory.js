'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'config', 'routing-inventory.json');

const fail = (message) => {
  process.stderr.write(`routing-inventory: ${message}\n`);
  process.exitCode = 1;
};

const readText = (relativePath) => {
  const absolutePath = path.join(root, relativePath);
  try {
    return fs.readFileSync(absolutePath, 'utf8');
  } catch (error) {
    fail(`cannot read ${relativePath}: ${error.message}`);
    return null;
  }
};

const hasDuplicates = (values) => new Set(values).size !== values.length;

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (error) {
  fail(`cannot parse config/routing-inventory.json: ${error.message}`);
  process.exit();
}

if (manifest.schemaVersion !== 1) {
  fail(`unsupported schemaVersion ${String(manifest.schemaVersion)}`);
}

if (!Array.isArray(manifest.sources) || manifest.sources.length === 0) {
  fail('sources must be a non-empty array');
}

const seenPaths = new Set();
for (const source of manifest.sources || []) {
  if (!source || typeof source.path !== 'string' || !source.path) {
    fail('every source requires a non-empty path');
    continue;
  }

  if (seenPaths.has(source.path)) {
    fail(`duplicate source path: ${source.path}`);
  }
  seenPaths.add(source.path);

  if (path.isAbsolute(source.path) || source.path.includes('..')) {
    fail(`unsafe source path: ${source.path}`);
    continue;
  }

  if (!source.owner || typeof source.owner !== 'string') {
    fail(`source ${source.path} requires an owner`);
  }

  if (!Array.isArray(source.requiredFragments) || source.requiredFragments.length === 0) {
    fail(`source ${source.path} requires at least one required fragment`);
    continue;
  }

  if (hasDuplicates(source.requiredFragments)) {
    fail(`source ${source.path} contains duplicate required fragments`);
  }

  const content = readText(source.path);
  if (content === null) continue;

  for (const fragment of source.requiredFragments) {
    if (typeof fragment !== 'string' || !fragment) {
      fail(`source ${source.path} contains an invalid required fragment`);
    } else if (!content.includes(fragment)) {
      fail(`${source.path} no longer contains required fragment ${JSON.stringify(fragment)}`);
    }
  }
}

const invariants = manifest.invariants || {};
const arrayFields = [
  'continuationKeysMustRemainExplicitlyDistinctUntilMigrated',
  'developmentReservedPaths',
  'productionNavigationExclusions',
  'productionNavigationSuffixExclusions',
];

for (const field of arrayFields) {
  const values = invariants[field];
  if (!Array.isArray(values) || values.length === 0) {
    fail(`invariants.${field} must be a non-empty array`);
    continue;
  }
  if (hasDuplicates(values)) {
    fail(`invariants.${field} contains duplicate values`);
  }
}

const continuationKeys = invariants.continuationKeysMustRemainExplicitlyDistinctUntilMigrated || [];
if (continuationKeys.length !== 2 || continuationKeys[0] === continuationKeys[1]) {
  fail('the two verified continuation keys must remain explicitly distinct until the implementation is migrated');
}

for (const field of ['developmentReservedPaths', 'productionNavigationExclusions', 'productionNavigationSuffixExclusions']) {
  for (const value of invariants[field] || []) {
    if (typeof value !== 'string' || !value.startsWith('/') || value.includes('\\')) {
      fail(`invariants.${field} contains invalid path ${JSON.stringify(value)}`);
    }
  }
}

if (!Array.isArray(manifest.explicitUnknowns) || manifest.explicitUnknowns.length === 0) {
  fail('explicitUnknowns must remain non-empty until the broader Phase 0 routing gate is closed');
}

if (!process.exitCode) {
  const summary = {
    schemaVersion: manifest.schemaVersion,
    status: manifest.status,
    checkedSources: manifest.sources.length,
    developmentReservedPaths: invariants.developmentReservedPaths.length,
    productionNavigationExclusions: invariants.productionNavigationExclusions.length,
    productionNavigationSuffixExclusions: invariants.productionNavigationSuffixExclusions.length,
    explicitUnknowns: manifest.explicitUnknowns.length,
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}
