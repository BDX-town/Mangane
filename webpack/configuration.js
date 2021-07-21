const { join } = require('path');
const { env } = require('process');

const settings = {
  source_path: 'app',
  public_root_path: 'static',
  test_root_path: 'static-test',
  cache_path: 'tmp/cache/webpacker',
  resolved_paths: [],
  static_assets_extensions: [ '.jpg', '.jpeg', '.png', '.tiff', '.ico', '.svg', '.gif', '.eot', '.otf', '.ttf', '.woff', '.woff2' ],
  extensions: [ '.mjs', '.js', '.sass', '.scss', '.css', '.module.sass', '.module.scss', '.module.css', '.png', '.svg', '.gif', '.jpeg', '.jpg' ],
};

const outputDir = env.NODE_ENV === 'test' ? settings.test_root_path : settings.public_root_path;

const output = {
  path: join(__dirname, '..', outputDir),
};

module.exports = {
  settings,
  env: {
    NODE_ENV: env.NODE_ENV,
  },
  output,
};
