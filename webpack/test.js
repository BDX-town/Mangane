// Note: You must restart bin/webpack-dev-server for changes to take effect
console.log('Running in test mode'); // eslint-disable-line no-console

const { merge } = require('webpack-merge');
const sharedConfig = require('./shared');

module.exports = merge(sharedConfig, {
  mode: 'development',
});
