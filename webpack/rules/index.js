const babel = require('./babel');
const git = require('./babel-git');
const gitRefresh = require('./git-refresh');
const buildConfig = require('./babel-build-config');
const css = require('./css');
const assets = require('./assets');
const nodeModules = require('./node_modules');

// https://github.com/webpack/webpack/issues/11467
const disableFullySpecified = {
  test: /\.m?js/,
  resolve: {
    fullySpecified: false,
  },
};

// Webpack loaders are processed in reverse order
// https://webpack.js.org/concepts/loaders/#loader-features
// Lastly, process static files using file loader
module.exports = [
  ...assets,
  css,
  disableFullySpecified,
  nodeModules,
  babel,
  git,
  gitRefresh,
  buildConfig,
];
