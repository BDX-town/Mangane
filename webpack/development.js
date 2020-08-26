// Note: You must restart bin/webpack-dev-server for changes to take effect
console.log('Running in development mode'); // eslint-disable-line no-console

const { resolve } = require('path');
const merge = require('webpack-merge');
const sharedConfig = require('./shared');
const { settings, output } = require('./configuration');

const watchOptions = {};

const backendUrl  = process.env.BACKEND_URL || 'http://localhost:4000';
const patronUrl  = process.env.PATRON_URL || 'http://localhost:3037';
const secureProxy = !(process.env.PROXY_HTTPS_INSECURE === 'true');

const backendEndpoints = [
  '/api',
  '/pleroma',
  '/nodeinfo',
  '/socket',
  '/oauth',
  '/auth/password',
  '/.well-known/webfinger',
  '/static',
  '/emoji',
];

const makeProxyConfig = () => {
  let proxyConfig = {};
  proxyConfig['/api/patron'] = {
    target: patronUrl,
    secure: secureProxy,
    changeOrigin: true,
  };
  backendEndpoints.map(endpoint => {
    proxyConfig[endpoint] = {
      target: backendUrl,
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

module.exports = merge(sharedConfig, {
  mode: 'development',
  cache: true,
  devtool: 'source-map',

  stats: {
    errorDetails: true,
  },

  output: {
    pathinfo: true,
  },

  devServer: {
    clientLogLevel: 'none',
    compress: settings.dev_server.compress,
    quiet: settings.dev_server.quiet,
    disableHostCheck: settings.dev_server.disable_host_check,
    host: settings.dev_server.host,
    port: settings.dev_server.port,
    https: settings.dev_server.https,
    hot: settings.dev_server.hmr,
    contentBase: resolve(__dirname, '..', settings.public_root_path),
    inline: settings.dev_server.inline,
    useLocalIp: settings.dev_server.use_local_ip,
    public: settings.dev_server.public,
    publicPath: output.publicPath,
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: settings.dev_server.headers,
    overlay: settings.dev_server.overlay,
    stats: {
      entrypoints: false,
      errorDetails: false,
      modules: false,
      moduleTrace: false,
    },
    watchOptions: Object.assign(
      {},
      settings.dev_server.watch_options,
      watchOptions
    ),
    serveIndex: true,
    proxy: makeProxyConfig(),
  },
});
