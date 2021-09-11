// Note: You must restart bin/webpack-dev-server for changes to take effect
console.log('Running in production mode'); // eslint-disable-line no-console

const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OfflinePlugin = require('@lcdp/offline-plugin');
const sharedConfig = require('./shared');

module.exports = merge(sharedConfig, {
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-warnings',
  bail: true,
  optimization: {
    minimize: true,
  },

  plugins: [
    // Generates report.html
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent',
    }),
    new OfflinePlugin({
      caches: {
        main: [':rest:'],
        additional: [
          'packs/emoji/1f602-*.svg', // used for emoji picker dropdown
          'packs/images/32-*.png',   // used in emoji-mart

          // Default emoji reacts
          'packs/emoji/1f44d-*.svg', // Thumbs up
          'packs/emoji/2764-*.svg',  // Heart
          'packs/emoji/1f606-*.svg', // Laughing
          'packs/emoji/1f62e-*.svg', // Surprised
          'packs/emoji/1f622-*.svg', // Crying
          'packs/emoji/1f629-*.svg', // Weary
          'packs/emoji/1f621-*.svg', // Angry (Spinster)
        ],
        optional: [
          '**/locale_*.js', // don't fetch every locale; the user only needs one
          '**/*_polyfills-*.js', // the user may not need polyfills
          '**/*.chunk.js', // only cache chunks when needed
          '**/*.woff2', // the user may have system-fonts enabled
          // images can be cached on-demand
          '**/*.png',
          '**/*.svg',
        ],
      },
      excludes: [
        '**/*.gz',
        '**/*.map',
        '**/*.LICENSE.txt',
        'stats.json',
        'report.html',
        'instance/**/*',
        // any browser that supports ServiceWorker will support woff2
        '**/*.eot',
        '**/*.ttf',
        '**/*-webfont-*.svg',
        '**/*.woff',
        // Sounds return a 206 causing sw.js to crash
        // https://stackoverflow.com/a/66335638
        '**/*.ogg',
        '**/*.oga',
        '**/*.mp3',
        // Don't serve index.html
        // https://github.com/bromite/bromite/issues/1294
        'index.html',
        '404.html',
      ],
      // ServiceWorker: {
      //   entry: join(__dirname, '../app/soapbox/service_worker/entry.js'),
      //   cacheName: 'soapbox',
      //   minify: true,
      // },
      safeToUseOptionalCaches: true,
    }),
  ],
});
