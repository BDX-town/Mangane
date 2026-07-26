'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { buildDesignTokenCss, validateDesignTokens } = require('./design-token-lib');

const root = path.resolve(process.env.DESIGN_TOKEN_ROOT || path.resolve(__dirname, '..'));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const tokens = JSON.parse(read('config/design-tokens.json'));

validateDesignTokens(tokens);
assert.equal(
  read('app/styles/design-tokens.generated.scss'),
  buildDesignTokenCss(tokens),
  'Generated design tokens drifted; run yarn generate:design-tokens',
);

const applicationStyles = read('app/styles/application.scss');
assert.ok(
  applicationStyles.includes('@import \'design-tokens.generated\';'),
  'Generated design tokens must remain in the global style graph',
);

const tailwind = read('tailwind.config.js');
assert.ok(
  tailwind.includes('require(\'./config/design-tokens.json\')'),
  'Tailwind must consume the canonical design token source',
);

process.stdout.write('Design token authority verified.\n');
