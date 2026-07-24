'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(process.env.REACT_QUERY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'react-query-authority-inventory.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const fail = (message) => { throw new Error(`react-query-authority: ${message}`); };

if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (!Array.isArray(manifest.queries) || manifest.queries.length === 0) fail('queries must be a non-empty array');
if (!Array.isArray(manifest.explicitUnknowns) || manifest.explicitUnknowns.length === 0) fail('explicitUnknowns must remain non-empty');

const seenPaths = new Set();
const seenKeys = new Set();
for (const query of manifest.queries) {
  if (!query || typeof query.path !== 'string' || typeof query.key !== 'string' || typeof query.endpoint !== 'string') fail('every query requires path, key and endpoint');
  if (seenPaths.has(query.path)) fail(`duplicate query path ${query.path}`);
  if (seenKeys.has(query.key)) fail(`duplicate query key ${query.key}`);
  seenPaths.add(query.path);
  seenKeys.add(query.key);

  const absolute = path.resolve(root, query.path);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe query source path ${query.path}`);
  const source = fs.readFileSync(absolute, 'utf8');

  const useQueryIndex = source.indexOf('useQuery');
  if (useQueryIndex < 0) fail(`${query.path} no longer calls useQuery`);
  const callStart = source.indexOf('(', useQueryIndex);
  if (callStart < 0) fail(`${query.path} contains an unparseable useQuery call`);
  const callPrefix = source.slice(callStart + 1, callStart + 300);
  const escapedKey = query.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keyPattern = new RegExp(`^\\s*\\[\\s*['\"]${escapedKey}['\"]\\s*\\]\\s*,`);
  if (!keyPattern.test(callPrefix)) fail(`${query.path} no longer declares exact unscoped query key ${query.key}`);
  if (!source.includes(query.endpoint)) fail(`${query.path} no longer contains endpoint ${query.endpoint}`);
  if (query.usesStatefulApi && !/const\s+api\s*=\s*useApi\(\)/.test(source)) fail(`${query.path} no longer uses the stateful useApi client`);
  if (query.duplicatesIntoRedux && !/dispatch\s*\(\s*fetchTrendsSuccess\s*\(/.test(source)) fail(`${query.path} no longer records the verified React Query-to-Redux duplication boundary`);
}

if (manifest.invariants?.keysAreCurrentlyUnscoped !== true) fail('current unscoped-key risk must remain explicit');
if (manifest.invariants?.accountAndInstanceDimensionsRequiredBeforeMigration !== true) fail('account/instance migration requirement must remain explicit');

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedQueries: manifest.queries.length,
  keys: manifest.queries.map(query => query.key),
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
