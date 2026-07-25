'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { discover } = require('./network-callsite-lib');

const root = path.resolve(process.env.NETWORK_CALLSITE_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'network-callsite-manifest.json');
const expected = discover(root);
const actual = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  throw new Error('network-callsite manifest drift detected; run yarn generate:network-callsites and reconcile the changed boundary');
}
if (!actual.calls.length) throw new Error('network-callsite manifest must not be empty');
for (const call of actual.calls) {
  for (const field of ['owner', 'authentication', 'accountScope', 'instanceScope', 'retrySafety', 'capability', 'fallback']) {
    if (!call[field]) throw new Error(`${call.id} is missing ${field}`);
  }
}

process.stdout.write(`${JSON.stringify({ checkedCalls: actual.calls.length, kinds: [...new Set(actual.calls.map(call => call.kind))].sort() }, null, 2)}\n`);
