const { resolve } = require('path');
const { env } = require('../configuration');

// This is a hack, used to force build_config @preval to recompile
// https://github.com/kentcdodds/babel-plugin-preval/issues/19

module.exports = {
  test: resolve(__dirname, '../../app/soapbox/build_config.js'),
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
