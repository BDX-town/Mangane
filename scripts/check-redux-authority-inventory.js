'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(process.env.REDUX_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'redux-authority-inventory.json'), 'utf8'));
const sourcePath = path.resolve(root, manifest.source);
const relative = path.relative(root, sourcePath);
if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Unsafe source path: ${manifest.source}`);
const source = fs.readFileSync(sourcePath, 'utf8');

const fail = (message) => { throw new Error(`redux-authority: ${message}`); };
const unique = (values) => new Set(values).size === values.length;

if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (!Array.isArray(manifest.reducers) || manifest.reducers.length === 0 || !unique(manifest.reducers)) fail('reducers must be a non-empty unique array');
if (!Array.isArray(manifest.logoutWhitelist) || manifest.logoutWhitelist.length === 0 || !unique(manifest.logoutWhitelist)) fail('logoutWhitelist must be a non-empty unique array');
if (!Array.isArray(manifest.explicitUnknowns) || manifest.explicitUnknowns.length === 0) fail('explicitUnknowns must remain non-empty');

const reducerBlock = source.match(/const reducers = \{([\s\S]*?)\n\};/);
if (!reducerBlock) fail('cannot locate root reducer registry');
const actualReducers = reducerBlock[1]
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('//'))
  .map(line => line.replace(/,$/, ''));

const whitelistMatch = source.match(/const whitelist: string\[\] = \[([^\]]+)\];/);
if (!whitelistMatch) fail('cannot locate logout whitelist');
const actualWhitelist = [...whitelistMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(match => match[1]);

const whitelistMutations = source.match(/\bwhitelist\s*(?:\.(?:push|pop|shift|unshift|splice|sort|reverse|copyWithin|fill)\s*\(|\[[^\]]+\]\s*=|=\s*)/g) || [];
if (whitelistMutations.length > 0) {
  fail(`logout whitelist must remain immutable after initialization; found ${JSON.stringify(whitelistMutations)}`);
}

const compare = (label, expected, actual) => {
  const missing = expected.filter(value => !actual.includes(value));
  const added = actual.filter(value => !expected.includes(value));
  if (missing.length || added.length || expected.length !== actual.length) {
    fail(`${label} drifted; missing=${JSON.stringify(missing)} added=${JSON.stringify(added)}`);
  }
};

compare('reducers', manifest.reducers, actualReducers);
compare('logoutWhitelist', manifest.logoutWhitelist, actualWhitelist);

for (const reducer of manifest.logoutWhitelist) {
  if (!manifest.reducers.includes(reducer)) fail(`logout whitelist references unknown reducer ${reducer}`);
}

const logoutAction = manifest.invariants.logoutAction;
const escapedLogoutAction = logoutAction.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const logoutCase = new RegExp(`case\\s+${escapedLogoutAction}\\s*:`);
if (!logoutCase.test(source)) fail(`source no longer handles logout action structurally: ${logoutAction}`);

const fragments = [
  `location.href = '${manifest.invariants.productionRedirect}'`,
  `const appReducer = ${manifest.invariants.combiner}(reducers, ${manifest.invariants.stateFactory})`,
  'return appReducer(logOut(state), action)',
];
for (const fragment of fragments) {
  if (!source.includes(fragment)) fail(`source no longer contains invariant ${JSON.stringify(fragment)}`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  reducers: actualReducers.length,
  logoutWhitelist: actualWhitelist,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
