#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { buildRegistry } = require('./documentation-authority-lib');

const root = path.resolve(process.env.DOCUMENTATION_AUTHORITY_ROOT || path.resolve(__dirname, '..'));
const destination = path.join(root, 'config', 'documentation-authority-registry.json');
fs.writeFileSync(destination, `${JSON.stringify(buildRegistry(root), null, 2)}\n`);
process.stdout.write(`${destination}\n`);
