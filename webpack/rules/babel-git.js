const { resolve } = require('path');
const { env } = require('../configuration');

// This is a hack, used in conjunction with rules/git-refresh.js
// https://github.com/kentcdodds/babel-plugin-preval/issues/19

module.exports = {
  test: resolve(__dirname, '../../app/soapbox/utils/code.js'),
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: false,
        cacheCompression: env.NODE_ENV === 'production',
        compact: env.NODE_ENV === 'production',
      },
    },
  ],
};
