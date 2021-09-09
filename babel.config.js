module.exports = (api) => {
  const env = api.env();

  const envOptions = {
    debug: false,
    modules: false,
    useBuiltIns: 'usage',
    corejs: '3.15',
  };

  const config = {
    presets: [
      '@babel/react',
      ['@babel/env', envOptions],
    ],
    plugins: [
      '@babel/syntax-dynamic-import',
      ['@babel/proposal-object-rest-spread', { useBuiltIns: true }],
      ['@babel/proposal-decorators', { legacy: true }],
      '@babel/proposal-class-properties',
      ['react-intl', { messagesDir: './build/messages/' }],
      'preval',
    ],
    'sourceType': 'unambiguous',
  };

  switch (env) {
  case 'production':
    config.plugins.push(...[
      'lodash',
      [
        'transform-react-remove-prop-types',
        {
          mode: 'remove',
          removeImport: true,
          additionalLibraries: [
            'react-immutable-proptypes',
          ],
        },
      ],
      '@babel/transform-react-inline-elements',
      [
        '@babel/transform-runtime',
        {
          helpers: true,
          regenerator: false,
          useESModules: true,
        },
      ],
    ]);
    break;
  case 'development':
    config.plugins.push(...[
      '@babel/transform-react-jsx-source',
      '@babel/transform-react-jsx-self',
    ]);
    break;
  case 'test':
    envOptions.modules = 'commonjs';
    break;
  }

  return config;
};
