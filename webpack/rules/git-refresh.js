const { resolve } = require('path');

// Recompile code.js whenever git changes
module.exports = {
  test: resolve(__dirname, '../../app/soapbox/utils/code.js'),
  use: {
    loader: resolve(__dirname, '../loaders/git-loader.js'),
  },
};
