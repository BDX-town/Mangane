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

function removeOuterSlashes(string) {
  return string.replace(/^\/*/, '').replace(/\/*$/, '');
}

function getPublicOutputPath() {
  if (env.NODE_ENV === 'test') {
    return 'packs-test';
  }

  return 'packs';
}

function formatPublicPath(host = '', path = '') {
  let formattedHost = removeOuterSlashes(host);
  if (formattedHost && !/^http/i.test(formattedHost)) {
    formattedHost = `//${formattedHost}`;
  }
  const formattedPath = removeOuterSlashes(path);
  return `${formattedHost}/${formattedPath}/`;
}

const output = {
  path: join(__dirname, '..', 'static', settings.public_output_path),
  publicPath: formatPublicPath(env.CDN_HOST, settings.public_output_path),
};

module.exports = {
  settings,
  env: {
    CDN_HOST: env.CDN_HOST,
    NODE_ENV: env.NODE_ENV,
  },
  output,
};
