const assets = require('./assets');
const babel = require('./babel');
const buildConfig = require('./babel-build-config');
const git = require('./babel-git');
const css = require('./css');
const gitRefresh = require('./git-refresh');
const nodeModules = require('./node_modules');

// Webpack loaders are processed in reverse order
// https://webpack.js.org/concepts/loaders/#loader-features
module.exports = [
  ...assets,
  css,
  nodeModules,
  babel,
  git,
  gitRefresh,
  buildConfig,
];
