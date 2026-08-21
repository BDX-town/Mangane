const plugin = require('tailwindcss/plugin');

/**
 * Re-implements the `divide-x`/`divide-y` core plugins so that empty nodes
 * (e.g. conditionally-rendered children that render nothing) are skipped
 * when computing dividers, instead of still counting as a sibling.
 */
module.exports = plugin(({ matchUtilities, addUtilities, theme }) => {
  matchUtilities({
    'divide-x': (value) => {
      value = value === '0' ? '0px' : value;
      return {
        '& > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
          '@defaults border-width': {},
          '--tw-divide-x-reverse': '0',
          'border-right-width': `calc(${value} * var(--tw-divide-x-reverse))`,
          'border-left-width': `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`,
        },
      };
    },
    'divide-y': (value) => {
      value = value === '0' ? '0px' : value;
      return {
        '& > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
          '@defaults border-width': {},
          '--tw-divide-y-reverse': '0',
          'border-top-width': `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`,
          'border-bottom-width': `calc(${value} * var(--tw-divide-y-reverse))`,
        },
      };
    },
  }, {
    values: theme('divideWidth'),
    type: ['line-width', 'length', 'any'],
  });

  addUtilities({
    '.divide-y-reverse > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
      '@defaults border-width': {},
      '--tw-divide-y-reverse': '1',
    },
    '.divide-x-reverse > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
      '@defaults border-width': {},
      '--tw-divide-x-reverse': '1',
    },
    '.divide-solid > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
      'border-style': 'solid',
    },
    '.divide-dashed > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
      'border-style': 'dashed',
    },
    '.divide-dotted > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
      'border-style': 'dotted',
    },
    '.divide-double > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
      'border-style': 'double',
    },
    '.divide-none > :not([hidden]):not(:empty) ~ :not([hidden]):not(:empty)': {
      'border-style': 'none',
    },
  });
}, {
  corePlugins: { divideWidth: false, divideStyle: false },
});
