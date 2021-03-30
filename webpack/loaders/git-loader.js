const { resolve } = require('path');

// Forces recompile whenever the current commit changes
// Useful for generating the version hash in the UI
module.exports = function(source, map) {
  this.addDependency(resolve(__dirname, '../../.git/logs/HEAD'));
  this.callback(null, source, map);
};
