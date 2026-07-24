'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(process.env.ROUTING_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'routing-inventory.json');

const failures = [];
const fail = (message) => failures.push(message);

const readText = (relativePath) => {
  const absolutePath = path.resolve(root, relativePath);
  const relative = path.relative(root, absolutePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    fail(`unsafe source path: ${relativePath}`);
    return null;
  }
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
  process.stderr.write(`routing-inventory: cannot parse config/routing-inventory.json: ${error.message}\n`);
  process.exit(1);
}

if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${String(manifest.schemaVersion)}`);
if (!Array.isArray(manifest.sources) || manifest.sources.length === 0) fail('sources must be a non-empty array');

const seenPaths = new Set();
const sourceContents = new Map();
for (const source of manifest.sources || []) {
  if (!source || typeof source.path !== 'string' || !source.path) {
    fail('every source requires a non-empty path');
    continue;
  }
  if (seenPaths.has(source.path)) fail(`duplicate source path: ${source.path}`);
  seenPaths.add(source.path);
  if (path.isAbsolute(source.path) || source.path.split(/[\\/]+/).includes('..')) {
    fail(`unsafe source path: ${source.path}`);
    continue;
  }
  if (!source.owner || typeof source.owner !== 'string') fail(`source ${source.path} requires an owner`);
  if (!Array.isArray(source.requiredFragments) || source.requiredFragments.length === 0) {
    fail(`source ${source.path} requires at least one required fragment`);
    continue;
  }
  if (hasDuplicates(source.requiredFragments)) fail(`source ${source.path} contains duplicate required fragments`);

  const content = readText(source.path);
  if (content === null) continue;
  sourceContents.set(source.path, content);
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
  if (hasDuplicates(values)) fail(`invariants.${field} contains duplicate values`);
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

const verifyOwnedValues = (field, sourcePath) => {
  const content = sourceContents.get(sourcePath);
  if (!content) {
    fail(`cannot verify invariants.${field}: owning source ${sourcePath} was not read`);
    return;
  }
  for (const value of invariants[field] || []) {
    const quotedSingle = `'${value}'`;
    const quotedDouble = `"${value}"`;
    if (!content.includes(quotedSingle) && !content.includes(quotedDouble)) {
      fail(`${sourcePath} no longer owns invariants.${field} value ${JSON.stringify(value)}`);
    }
  }
};

verifyOwnedValues('developmentReservedPaths', 'webpack/development.js');
verifyOwnedValues('productionNavigationExclusions', 'webpack/production.js');

const productionContent = sourceContents.get('webpack/production.js');
for (const suffix of invariants.productionNavigationSuffixExclusions || []) {
  if (productionContent && !productionContent.includes(`endsWith('${suffix}')`) && !productionContent.includes(`endsWith("${suffix}")`)) {
    fail(`webpack/production.js no longer owns invariants.productionNavigationSuffixExclusions value ${JSON.stringify(suffix)}`);
  }
}

if (!Array.isArray(manifest.explicitUnknowns) || manifest.explicitUnknowns.length === 0) {
  fail('explicitUnknowns must remain non-empty until the broader Phase 0 routing gate is closed');
}

if (failures.length > 0) {
  for (const message of failures) process.stderr.write(`routing-inventory: ${message}\n`);
  process.exit(1);
}

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
