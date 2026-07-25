'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { discover } = require('./network-callsite-lib');

const root = path.resolve(__dirname, '..');
const destination = path.join(root, 'config', 'network-callsite-manifest.json');
fs.writeFileSync(destination, `${JSON.stringify(discover(root), null, 2)}\n`);
process.stdout.write(`${destination}\n`);
