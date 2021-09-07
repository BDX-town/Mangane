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
        additional: [':externals:'],
        optional: [
          '**/locale_*.js', // don't fetch every locale; the user only needs one
          '**/*_polyfills-*.js', // the user may not need polyfills
          '**/*.chunk.js', // only cache chunks when needed
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
        'instance',
        // any browser that supports ServiceWorker will support woff2
        '**/*.eot',
        '**/*.ttf',
        '**/*-webfont-*.svg',
        '**/*.woff',
        // Sounds return a 206 causing sw.js to crash
        // https://stackoverflow.com/a/66335638
        'sounds/**/*',
        // Don't cache index.html
        'index.html',
      ],
      // ServiceWorker: {
      //   entry: join(__dirname, '../app/soapbox/service_worker/entry.js'),
      //   cacheName: 'soapbox',
      //   minify: true,
      // },
    }),
  ],
});
