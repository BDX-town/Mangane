const ASSET_EXTS = 'css|styl|less|sass|scss|png|jpg|svg|ogg|oga|mp3|ttf|woff|woff2';

module.exports = {
  'testPathIgnorePatterns': [
    '<rootDir>/node_modules/',
    '<rootDir>/vendor/',
    '<rootDir>/config/',
    '<rootDir>/log/',
    '<rootDir>/static/',
    '<rootDir>/tmp/',
    '<rootDir>/webpack/',
  ],
  'setupFiles': [
    'raf/polyfill',
  ],
  'setupFilesAfterEnv': [
    '<rootDir>/app/soapbox/jest/test-setup.ts',
  ],
  'collectCoverageFrom': [
    'app/soapbox/**/*.js',
    'app/soapbox/**/*.ts',
    'app/soapbox/**/*.tsx',
    '!app/soapbox/features/emoji/emoji_compressed.js',
    '!app/soapbox/locales/locale-data/*.js',
    '!app/soapbox/service_worker/entry.ts',
    '!app/soapbox/jest/test-setup.ts',
    '!app/soapbox/jest/test-helpers.ts',
  ],
  'coverageDirectory': '<rootDir>/.coverage/',
  'coverageReporters': ['html', 'text', 'text-summary', 'cobertura'],
  'coverageThreshold': {
    global: {
      branches: 27,
      functions: 26,
      lines: 38,
      statements: 36,
    },
  },
  'reporters': ['default', 'jest-junit'],
  'moduleDirectories': [
    'node_modules',
    '<rootDir>/app',
  ],
  'moduleNameMapper': {
    // eld exposes ESM-only conditional exports; Jest 28 resolves CommonJS by default.
    '^eld/small$': '<rootDir>/node_modules/eld/src/entries/static.small.js',
    // https://github.com/uuidjs/uuid/pull/616#issuecomment-1111012599
    '^uuid$': require.resolve('uuid'),
  },
  // Node-native governance tests under scripts/__tests__ are run with `node --test`.
  // Keep Jest scoped to application tests and the few script suites written for Jest.
  'testMatch': [
    '<rootDir>/app/**/*/__tests__/**/?(*.|*-)+(test).(ts|js)?(x)',
    '<rootDir>/tailwind/**/*/__tests__/**/?(*.|*-)+(test).(ts|js)?(x)',
    '<rootDir>/scripts/__tests__/architecture-inventory.test.js',
    '<rootDir>/scripts/__tests__/check-redux-authority-inventory.test.js',
    '<rootDir>/scripts/__tests__/check-routing-inventory.test.js',
  ],
  'testEnvironment': 'jsdom',
  'transformIgnorePatterns': [
    // FIXME: react-sticky-box and eld don't provide compatible CJS builds, so transform them for now
    // https://github.com/codecks-io/react-sticky-box/issues/79
    `/node_modules/(?!(eld|react-sticky-box|.+\\.(${ASSET_EXTS})$))`,
    // Ignore node_modules, except static assets
    // `/node_modules/(?!.+\\.(${ASSET_EXTS})$)`,
  ],
  'transform': {
    '\\.[jt]sx?$': 'babel-jest',
    [`\\.(${ASSET_EXTS})$`]: '<rootDir>/jest/assetTransformer.js',
  },
};
