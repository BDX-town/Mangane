// Note: You must restart bin/webpack-dev-server for changes to take effect

const { resolve, join } = require('path');
const merge = require('webpack-merge');
const sharedConfig = require('./shared');
const { settings, output } = require('./configuration');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const watchOptions = {};

// TODO: Make this configurable
const backendUrl = 'http://localhost:4000';

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
    proxy: {
      '/api': backendUrl,
      '/nodeinfo': backendUrl,
      '/socket': backendUrl,
      '/oauth/revoke': backendUrl,
      '/.well-known/webfinger': backendUrl,
    },
  },
});
