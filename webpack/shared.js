// Note: You must restart bin/webpack-dev-server for changes to take effect

const fs = require('fs');
const { join, resolve } = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const AssetsManifestPlugin = require('webpack-assets-manifest');
const DeadCodePlugin = require('webpack-deadcode-plugin');

const { env, settings, output } = require('./configuration');
const rules = require('./rules');

const { FE_SUBDIRECTORY, FE_INSTANCE_SOURCE_DIR } = require(join(__dirname, '..', 'app', 'soapbox', 'build_config'));

// Return file as string, or return empty string
const readFile = filename => {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch {
    return '';
  }
};

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
    templateParameters: {
      snippets: readFile(resolve('custom/snippets.html')),
    },
  }, params);
};

module.exports = {
  entry: {
    application: resolve('app/application.ts'),
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
    new ForkTsCheckerWebpackPlugin({ typescript: { memoryLimit: 8192 } }),
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
    // https://github.com/MQuy/webpack-deadcode-plugin
    new DeadCodePlugin({
      patterns: [
        'app/**/*',
      ],
      exclude: [
        '**/*.test.*',
        '**/__*__/*',
        '**/(LICENSE|README|COPYING)(.md|.txt)?',
        // This file is imported with @preval
        'app/soapbox/features/emoji/emoji_map.json',
      ],
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
        from: join(__dirname, '..', 'app', FE_INSTANCE_SOURCE_DIR),
        to: join(output.path, 'instance'),
      }, {
        from: join(__dirname, '../custom/instance'),
        to: join(output.path, 'instance'),
        noErrorOnMissing: true,
        globOptions: {
          ignore: ['**/.gitkeep'],
        },
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
    alias: {
      // Override tabler's package.json to allow importing .svg files directly
      // https://stackoverflow.com/a/35990101/8811886
      '@tabler': resolve('node_modules', '@tabler'),
      'icons': resolve('app', 'icons'),
      'custom': resolve('custom'),
    },
    fallback: {
      path: require.resolve('path-browserify'),
      util: require.resolve('util'),
    },
  },

  resolveLoader: {
    modules: ['node_modules'],
  },
};
