'use strict';

const { join } = require('path');

const {
  FE_BUILD_DIR,
  FE_SUBDIRECTORY,
} = require(join(__dirname, 'app', 'soapbox', 'build_config'));

module.exports = {
  plugins: [],
  recurseDepth: 10,
  opts: {
    destination: join(__dirname, FE_BUILD_DIR, FE_SUBDIRECTORY, 'jsdoc'),
    recurse: true,
  },
  source: {
    include: join(__dirname, 'app'),
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '(^|\\/|\\\\)_',
  },
  sourceType: 'module',
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure'],
  },
  templates: {
    cleverLinks: false,
    monospaceLinks: false,
  },
};
