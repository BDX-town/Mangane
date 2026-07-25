'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { discover } = require('./persistence-inventory-lib');

const root = path.resolve(process.env.PERSISTENCE_MANIFEST_ROOT || path.resolve(__dirname, '..'));
const actual = JSON.parse(fs.readFileSync(path.join(root, 'config', 'persistence-manifest.json'), 'utf8'));
const expected = discover(root);
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  throw new Error('persistence manifest drift detected; regenerate and reconcile every lifecycle field');
}
if (!actual.calls.length) throw new Error('persistence manifest must not be empty');
for (const call of actual.calls) {
  for (const field of ['authority', 'accountScope', 'instanceScope', 'ttl', 'migration', 'cleanupTrigger', 'logoutBehavior']) {
    if (!call[field]) throw new Error(`${call.id} is missing ${field}`);
  }
}
process.stdout.write(`${JSON.stringify({
  checkedCalls: actual.calls.length,
  engines: [...new Set(actual.calls.map(call => call.engine))].sort(),
  purgeSteps: actual.purgeOrder.length,
}, null, 2)}\n`);
