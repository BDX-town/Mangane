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
    '!app/soapbox/service_worker/entry.js',
    '!app/soapbox/jest/test-setup.ts',
    '!app/soapbox/jest/test-helpers.ts',
  ],
  'coverageDirectory': '<rootDir>/coverage',
  'moduleDirectories': [
    '<rootDir>/node_modules',
    '<rootDir>/app',
  ],
  'testEnvironment': 'jsdom',
  'moduleNameMapper': {
    '^.+.(css|styl|less|sass|scss|png|jpg|svg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  'transform': {
    '\\.[jt]sx?$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|svg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
};
