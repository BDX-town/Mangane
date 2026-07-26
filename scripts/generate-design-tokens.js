'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { buildDesignTokenCss } = require('./design-token-lib');

const root = path.resolve(__dirname, '..');
const tokenPath = path.join(root, 'config', 'design-tokens.json');
const outputPath = path.join(root, 'app', 'styles', 'design-tokens.generated.scss');
const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));

fs.writeFileSync(outputPath, buildDesignTokenCss(tokens));
process.stdout.write(`${path.relative(root, outputPath)}\n`);
