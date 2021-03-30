const { resolve } = require('path');
const { env } = require('../configuration');

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
