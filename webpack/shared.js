// Note: You must restart bin/webpack-dev-server for changes to take effect

const webpack = require('webpack');
const { join, resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AssetsManifestPlugin = require('webpack-assets-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const { env, settings, output } = require('./configuration');
const rules = require('./rules');

module.exports = {
  entry: Object.assign(
    { application: resolve('app/application.js') },
    { styles: resolve(join(settings.source_path, 'styles/application.scss')) },
  ),

  output: {
    filename: 'packs/js/[name]-[chunkhash].js',
    chunkFilename: 'packs/js/[name]-[chunkhash].chunk.js',
    hotUpdateChunkFilename: 'packs/js/[id]-[hash].hot-update.js',
    path: output.path,
    publicPath: '/',
  },

  optimization: {
    runtimeChunk: {
      name: 'common',
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          minSize: 0,
          test: /^(?!.*[\\\/]node_modules[\\\/]react-intl[\\\/]).+$/,
        },
      },
    },
    occurrenceOrder: true,
  },

  module: {
    rules: Object.keys(rules).map(key => rules[key]),
  },

  plugins: [
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(env))),
    new webpack.NormalModuleReplacementPlugin(
      /^history\//, (resource) => {
        // temporary fix for https://github.com/ReactTraining/react-router/issues/5576
        // to reduce bundle size
        resource.request = resource.request.replace(/^history/, 'history/es');
      },
    ),
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
    // https://www.npmjs.com/package/unused-files-webpack-plugin#options
    new UnusedFilesWebpackPlugin({
      patterns: ['app/**/*.*'],
      globOptions: {
        ignore: ['node_modules/**/*', '**/__*__/**/*'],
      },
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
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
    }),
    new HtmlWebpackHarddiskPlugin(),
    new CopyPlugin({
      patterns: [{
        from: join(__dirname, '../node_modules/twemoji/assets/svg'),
        to: join(output.path, 'emoji'),
      }, {
        from: join(__dirname, '../node_modules/emoji-datasource/img/twitter/sheets/32.png'),
        to: join(output.path, 'emoji/sheet_13.png'),
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
  },

  resolveLoader: {
    modules: ['node_modules'],
  },

  node: {
    // Called by http-link-header in an API we never use, increases
    // bundle size unnecessarily
    Buffer: false,
  },
};
