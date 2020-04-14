module.exports = {
  'projects': [
    '<rootDir>/app/gabsocial',
  ],
  'testPathIgnorePatterns': [
    '<rootDir>/node_modules/',
    '<rootDir>/vendor/',
    '<rootDir>/config/',
    '<rootDir>/log/',
    '<rootDir>/public/',
    '<rootDir>/tmp/',
    '<rootDir>/webpack/',
  ],
  'setupFiles': [
    'raf/polyfill',
  ],
  'setupFilesAfterEnv': [
    '<rootDir>/app/gabsocial/test_setup.js',
  ],
  'collectCoverageFrom': [
    'app/gabsocial/**/*.js',
    '!app/gabsocial/features/emoji/emoji_compressed.js',
    '!app/gabsocial/locales/locale-data/*.js',
    '!app/gabsocial/service_worker/entry.js',
    '!app/gabsocial/test_setup.js',
  ],
  'coverageDirectory': '<rootDir>/coverage',
  'moduleDirectories': [
    '<rootDir>/node_modules',
    '<rootDir>/app',
  ],
};
