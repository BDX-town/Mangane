const babel = require('./babel');
const git = require('./babel-git');
const gitRefresh = require('./git-refresh');
const buildConfig = require('./babel-build-config');
const css = require('./css');
const assets = require('./assets');
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
