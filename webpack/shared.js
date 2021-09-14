// Note: You must restart bin/webpack-dev-server for changes to take effect

const webpack = require('webpack');
const { join, resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AssetsManifestPlugin = require('webpack-assets-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { env, settings, output } = require('./configuration');
const rules = require('./rules');

const { FE_SUBDIRECTORY } = require(join(__dirname, '..', 'app', 'soapbox', 'build_config'));

const makeHtmlConfig = (params = {}) => {
  return Object.assign({
    template: 'app/index.ejs',
    chunksSortMode: 'manual',
    chunks: ['common', 'locale_en', 'application', 'styles'],
    alwaysWriteToDisk: true,
    minify: {
      collapseWhitespace: true,
      removeComments: false,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    },
  }, params);
};

module.exports = {
  entry: {
    application: resolve('app/application.js'),
  },

  output: {
    filename: 'packs/js/[name]-[chunkhash].js',
    chunkFilename: 'packs/js/[name]-[chunkhash].chunk.js',
    hotUpdateChunkFilename: 'packs/js/[id]-[contenthash].hot-update.js',
    path: output.path,
    publicPath: join(FE_SUBDIRECTORY, '/'),
  },

  optimization: {
    chunkIds: 'total-size',
    moduleIds: 'size',
    runtimeChunk: {
      name: 'common',
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        defaultVendors: false,
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          minSize: 0,
          test: /^(?!.*[\\\/]node_modules[\\\/]react-intl[\\\/]).+$/,
        },
      },
    },
  },

  module: {
    rules,
  },

  plugins: [
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(env))),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new MiniCssExtractPlugin({
      filename: 'packs/css/[name]-[contenthash:8].css',
      chunkFilename: 'packs/css/[name]-[contenthash:8].chunk.css',
    }),
    new AssetsManifestPlugin({
      integrity: false,
      entrypoints: true,
      writeToDisk: true,
      publicPath: true,
    }),
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin(makeHtmlConfig()),
    new HtmlWebpackPlugin(makeHtmlConfig({ filename: '404.html' })),
    new HtmlWebpackHarddiskPlugin(),
    new CopyPlugin({
      patterns: [{
        from: join(__dirname, '../node_modules/twemoji/assets/svg'),
        to: join(output.path, 'packs/emoji'),
      }, {
        from: join(__dirname, '../app/instance'),
        to: join(output.path, 'instance'),
      }],
      options: {
        concurrency: 100,
      },
    }),
  ],

  resolve: {
    extensions: settings.extensions,
    modules: [
      resolve(settings.source_path),
      'node_modules',
    ],
    fallback: {
      path: require.resolve('path-browserify'),
      util: require.resolve('util'),
    },
  },

  resolveLoader: {
    modules: ['node_modules'],
  },
};
