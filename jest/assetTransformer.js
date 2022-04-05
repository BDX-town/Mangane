const path = require('path');

// Custom Jest asset transformer
// https://jestjs.io/docs/code-transformation#writing-custom-transformers
// Tries to do basically what Webpack does
module.exports = {
  process(src, filename, config, options) {
    return `module.exports = "https://soapbox.test/assets/${path.basename(filename)}";`;
  },
};
