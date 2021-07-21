// Note: You must restart bin/webpack-dev-server for changes to take effect
console.log('Running in production mode'); // eslint-disable-line no-console

const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OfflinePlugin = require('offline-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const sharedConfig = require('./shared');

module.exports = merge(sharedConfig, {
  mode: 'production',
  devtool: 'source-map',
  stats: 'normal',
  bail: true,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,

        terserOptions: {
          warnings: false,
          mangle: false,

          output: {
            comments: false,
          },
        },
      }),
    ],
  },

  plugins: [
    new CompressionPlugin({
      test: /\.(js|css|html|json|ico|svg|eot|otf|ttf|map)$/,
    }),
    new BundleAnalyzerPlugin({ // generates report.html
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent', // do not bother Webpacker, who runs with --json and parses stdout
    }),
    new OfflinePlugin({
      caches: {
        main: [':rest:'],
        additional: [':externals:'],
        optional: [
          '**/locale_*.js', // don't fetch every locale; the user only needs one
          '**/*_polyfills-*.js', // the user may not need polyfills
          '**/*.woff2', // the user may have system-fonts enabled
          // images/audio can be cached on-demand
          '**/*.png',
          '**/*.jpg',
          '**/*.jpeg',
          '**/*.svg',
          '**/*.mp3',
          '**/*.ogg',
        ],
      },
      externals: [
        '/emoji/1f602.svg', // used for emoji picker dropdown
        '/emoji/sheet_13.png', // used in emoji-mart

        // Default emoji reacts
        '/emoji/1f44d.svg', // Thumbs up
        '/emoji/2764.svg',  // Heart
        '/emoji/1f606.svg', // Laughing
        '/emoji/1f62e.svg', // Surprised
        '/emoji/1f622.svg', // Crying
        '/emoji/1f629.svg', // Weary
        '/emoji/1f621.svg', // Angry (Spinster)
      ],
      excludes: [
        '**/*.gz',
        '**/*.map',
        'stats.json',
        'report.html',
        // any browser that supports ServiceWorker will support woff2
        '**/*.eot',
        '**/*.ttf',
        '**/*-webfont-*.svg',
        '**/*.woff',
      ],
      // ServiceWorker: {
      //   entry: join(__dirname, '../app/soapbox/service_worker/entry.js'),
      //   cacheName: 'soapbox',
      //   minify: true,
      // },
    }),
  ],
});
