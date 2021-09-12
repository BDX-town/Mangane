// Note: You must restart bin/webpack-dev-server for changes to take effect
console.log('Running in production mode'); // eslint-disable-line no-console

const { join } = require('path');
const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OfflinePlugin = require('@lcdp/offline-plugin');
const sharedConfig = require('./shared');

const { FE_SUBDIRECTORY } = require(join(__dirname, '..', 'app', 'soapbox', 'build_config'));
const joinPublicPath = (...paths) => join(FE_SUBDIRECTORY, ...paths);

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
          ':externals:',
          'packs/images/32-*.png', // used in emoji-mart
        ],
        optional: [
          '**/locale_*.js', // don't fetch every locale; the user only needs one
          '**/*_polyfills-*.js', // the user may not need polyfills
          '**/*.chunk.js', // only cache chunks when needed
          '**/*.chunk.css',
          '**/*.woff2', // the user may have system-fonts enabled
          // images can be cached on-demand
          '**/*.png',
          '**/*.svg',
        ],
      },
      externals: [
        joinPublicPath('packs/emoji/1f602.svg'), // used for emoji picker dropdown

        // Default emoji reacts
        joinPublicPath('packs/emoji/1f44d.svg'), // Thumbs up
        joinPublicPath('packs/emoji/2764.svg'),  // Heart
        joinPublicPath('packs/emoji/1f606.svg'), // Laughing
        joinPublicPath('packs/emoji/1f62e.svg'), // Surprised
        joinPublicPath('packs/emoji/1f622.svg'), // Crying
        joinPublicPath('packs/emoji/1f629.svg'), // Weary
        joinPublicPath('packs/emoji/1f621.svg'), // Angry (Spinster)
      ],
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
        'assets-manifest.json',
        // It would be nice to serve these, but they bloat up sw.js
        'packs/images/crypto/**/*',
        'packs/emoji/**/*',
      ],
      ServiceWorker: {
        // entry: join(__dirname, '../app/soapbox/service_worker/entry.js'),
        // cacheName: 'soapbox',
        minify: true,
      },
      safeToUseOptionalCaches: true,
    }),
  ],
});
