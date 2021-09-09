const { join } = require('path');
const { settings } = require('../configuration');

module.exports = {
  test: new RegExp(`(${settings.static_assets_extensions.join('|')})$`, 'i'),
  use: [
    {
      loader: 'file-loader',
      options: {
        name(file) {
          if (file.includes(settings.source_path)) {
            return 'packs/media/[path][name]-[contenthash].[ext]';
          }
          return 'packs/media/[folder]/[name]-[contenthash:8].[ext]';
        },
        context: join(settings.source_path),
      },
    },
  ],
};
