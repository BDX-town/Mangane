// Asset modules
// https://webpack.js.org/guides/asset-modules/

const { resolve } = require('path');

// These are processed in reverse-order
// We use the name 'packs' instead of 'assets' for legacy reasons
module.exports = [{
  test: /\.(png|svg)/,
  type: 'asset/resource',
  include: [
    resolve('app', 'images'),
    resolve('node_modules', 'emoji-datasource'),
  ],
  generator: {
    filename: 'packs/images/[name]-[contenthash:8][ext]',
  },
}, {
  test: /\.(ttf|eot|svg|woff|woff2)/,
  type: 'asset/resource',
  include: [
    resolve('app', 'fonts'),
    resolve('node_modules', 'fork-awesome'),
    resolve('node_modules', '@fontsource'),
  ],
  generator: {
    filename: 'packs/fonts/[name]-[contenthash:8][ext]',
  },
}, {
  test: /\.(ogg|oga|mp3)/,
  type: 'asset/resource',
  include: resolve('app', 'sounds'),
  generator: {
    filename: 'packs/sounds/[name]-[contenthash:8][ext]',
  },
}, {
  test: /\.svg$/,
  type: 'asset/resource',
  include: resolve('node_modules', 'twemoji'),
  generator: {
    filename: 'packs/emoji/[name]-[contenthash:8][ext]',
  },
}, {
  test: /\.svg$/,
  type: 'asset/resource',
  include: resolve('node_modules', 'cryptocurrency-icons'),
  generator: {
    filename: 'packs/images/crypto/[name]-[contenthash:8][ext]',
  },
}];
