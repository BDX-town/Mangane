const { join } = require('path');
const { env } = require('process');

const settings = {
  source_path: 'app',
  public_root_path: 'static',
  public_output_path: getPublicOutputPath(),
  cache_path: 'tmp/cache/webpacker',
  resolved_paths: [],
  static_assets_extensions: [ '.jpg', '.jpeg', '.png', '.tiff', '.ico', '.svg', '.gif', '.eot', '.otf', '.ttf', '.woff', '.woff2' ],
  extensions: [ '.mjs', '.js', '.sass', '.scss', '.css', '.module.sass', '.module.scss', '.module.css', '.png', '.svg', '.gif', '.jpeg', '.jpg' ],
};

function getPublicOutputPath() {
  if (env.NODE_ENV === 'test') {
    return 'packs-test';
  }

  return 'packs';
}

function packsPath(path) {
  return join(settings.public_output_path, path);
}

module.exports = {
  settings,
  env: {
    NODE_ENV: env.NODE_ENV,
  },
  packsPath,
};
