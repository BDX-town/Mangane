// Note: You must restart bin/webpack-dev-server for changes to take effect
console.log('Running in development mode'); // eslint-disable-line no-console

const { join } = require('path');

const { merge } = require('webpack-merge');

const sharedConfig = require('./shared');

const watchOptions = {};

const {
  DEVSERVER_URL,
  BACKEND_URL,
  PATRON_URL,
  PROXY_HTTPS_INSECURE,
} = process.env;

const DEFAULTS = {
  DEVSERVER_URL: 'http://localhost:3036',
  PATRON_URL: 'http://localhost:3037',
};

const { FE_SUBDIRECTORY } = require(join(__dirname, '..', 'app', 'soapbox', 'build_config'));

const backendEndpoints = [
  '/api',
  '/pleroma',
  '/nodeinfo',
  '/socket',
  '/oauth',
  '/.well-known/webfinger',
  '/static',
  '/main/ostatus',
  '/ostatus_subscribe',
  '/favicon.png',
];

const makeProxyConfig = () => {
  const secureProxy = PROXY_HTTPS_INSECURE !== 'true';

  const proxyConfig = {};
  proxyConfig['/api/patron'] = {
    target: PATRON_URL || DEFAULTS.PATRON_URL,
    secure: secureProxy,
    changeOrigin: true,
  };
  backendEndpoints.map(endpoint => {
    proxyConfig[endpoint] = {
      target: BACKEND_URL || DEFAULTS.BACKEND_URL,
      secure: secureProxy,
      changeOrigin: true,
    };
  });
  return proxyConfig;
};

if (process.env.VAGRANT) {
  // If we are in Vagrant, we can't rely on inotify to update us with changed
  // files, so we must poll instead. Here, we poll every second to see if
  // anything has changed.
  watchOptions.poll = 1000;
}

const devServerUrl = (() => {
  try {
    return new URL(DEVSERVER_URL);
  } catch {
    return new URL(DEFAULTS.DEVSERVER_URL);
  }
})();

module.exports = merge(sharedConfig, {
  mode: 'development',
  cache: true,
  devtool: 'source-map',

  stats: {
    preset: 'errors-warnings',
    errorDetails: true,
  },

  output: {
    pathinfo: true,
  },

  watchOptions: Object.assign(
    {},
    { ignored: '**/node_modules/**' },
    watchOptions,
  ),

  devServer: {
    compress: true,
    host: devServerUrl.hostname,
    port: devServerUrl.port,
    https: devServerUrl.protocol === 'https:',
    hot: false,
    allowedHosts: 'all',
    historyApiFallback: {
      disableDotRule: true,
      index: join(FE_SUBDIRECTORY, '/'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: {
      overlay: true,
    },
    static: {
      serveIndex: true,
    },
    proxy: makeProxyConfig(),
  },
});
