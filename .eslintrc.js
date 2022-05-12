module.exports = {
  root: true,

  extends: [
    'eslint:recommended',
    'plugin:import/typescript',
  ],

  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },

  globals: {
    ATTACHMENT_HOST: false,
  },

  parser: 'babel-eslint',

  plugins: [
    'react',
    'jsdoc',
    'jsx-a11y',
    'import',
    'promise',
    'react-hooks',
    '@typescript-eslint',
  ],

  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    ecmaVersion: 2018,
  },

  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/ignore': [
      'node_modules',
      '\\.(css|scss|json)$',
    ],
    'import/resolver': {
      node: {
        paths: ['app'],
      },
    },
  },

  rules: {
    'brace-style': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': [
      'warn',
      {
        before: false,
        after: true,
      },
    ],
    'comma-style': ['warn', 'last'],
    'space-before-function-paren': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-in-parens': ['error', 'never'],
    'keyword-spacing': 'error',
    'consistent-return': 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    indent: ['error', 2, {
      SwitchCase: 1, // https://stackoverflow.com/a/53055584/8811886
      ignoredNodes: ['TemplateLiteral'],
    }],
    'jsx-quotes': ['error', 'prefer-single'],
    'key-spacing': [
      'error',
      { mode: 'minimum' },
    ],
    'no-catch-shadow': 'error',
    'no-cond-assign': 'error',
    'no-console': [
      'warn',
      {
        allow: [
          'error',
          'warn',
        ],
      },
    ],
    'no-extra-semi': 'error',
    'no-const-assign': 'error',
    'no-fallthrough': 'error',
    'no-irregular-whitespace': 'error',
    'no-loop-func': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-nested-ternary': 'warn',
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['react-inlinesvg'],
        message: 'Use the SvgIcon component instead.',
      }],
    }],
    'no-trailing-spaces': 'warn',
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    'no-useless-escape': 'warn',
    'no-var': 'error',
    'object-curly-spacing': ['error', 'always'],
    'padded-blocks': [
      'error',
      {
        classes: 'always',
      },
    ],
    'prefer-const': 'error',
    quotes: ['error', 'single'],
    semi: 'error',
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false,
      },
    ],
    strict: 'off',
    'valid-typeof': 'error',

    'react/jsx-boolean-value': 'error',
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-curly-spacing': 'error',
    'react/jsx-equals-spacing': 'error',
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-indent': ['error', 2],
    // 'react/jsx-no-bind': ['error'],
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-tag-spacing': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-wrap-multilines': 'error',
    'react/no-multi-comp': 'off',
    'react/no-string-refs': 'error',
    'react/self-closing-comp': 'error',

    'jsx-a11y/accessible-emoji': 'warn',
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-has-content': 'warn',
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        components: [
          'Link',
          'NavLink',
        ],
        specialLink: [
          'to',
        ],
        aspect: [
          'noHref',
          'invalidHref',
          'preferButton',
        ],
      },
    ],
    'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-role': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/heading-has-content': 'warn',
    'jsx-a11y/html-has-lang': 'warn',
    'jsx-a11y/iframe-has-title': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    'jsx-a11y/interactive-supports-focus': 'warn',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/no-access-key': 'warn',
    'jsx-a11y/no-distracting-elements': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': [
      'warn',
      {
        handlers: [
          'onClick',
        ],
      },
    ],
    'jsx-a11y/no-onchange': 'warn',
    'jsx-a11y/no-redundant-roles': 'warn',
    'jsx-a11y/no-static-element-interactions': [
      'warn',
      {
        handlers: [
          'onClick',
        ],
      },
    ],
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'off',
    'jsx-a11y/scope': 'warn',
    'jsx-a11y/tabindex-no-positive': 'warn',

    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        mjs: 'ignorePackages',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      // {
      //   devDependencies: [
      //     'webpack/**',
      //     'app/soapbox/test_setup.js',
      //     'app/soapbox/test_helpers.js',
      //     'app/**/__tests__/**',
      //     'app/**/__mocks__/**',
      //   ],
      // },
    ],
    'import/no-unresolved': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],

    'promise/catch-or-return': 'error',

    'react-hooks/rules-of-hooks': 'error',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-undef': 'off', // https://stackoverflow.com/a/69155899
      },
      parser: '@typescript-eslint/parser',
    },
    {
      // Only enforce JSDoc comments on UI components for now.
      // https://www.npmjs.com/package/eslint-plugin-jsdoc
      files: ['app/soapbox/components/ui/**/*'],
      rules: {
        'jsdoc/require-jsdoc': ['error', {
          publicOnly: true,
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        }],
      },
    },
  ],
};
