const { settings } = require('../configuration');

module.exports = {
  test: new RegExp(`(${settings.static_assets_extensions.join('|')})$`, 'i'),
  type: 'asset/resource',
  generator: {
    filename: 'packs/media/[contenthash][ext]',
  },
};
