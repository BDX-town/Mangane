const designTokens = require('./config/design-tokens.json');
const { parseColorMatrix } = require('./tailwind/colors');

module.exports = {
  content: ['./app/**/*.{html,js,ts,tsx}', './custom/instance/**/*.html'],
  darkMode: 'class',
  theme: {
    screens: designTokens.primitives.breakpoint,
    extend: {
      boxShadow: {
        '3xl': '0 25px 75px -15px rgba(0, 0, 0, 0.25)',
        'design-1': 'var(--ds-elevation-1)',
        'design-2': 'var(--ds-elevation-2)',
        'design-3': 'var(--ds-elevation-3)',
      },
      fontSize: {
        base: '0.9375rem',
        'design-xs': ['var(--ds-font-size-xs)', 'var(--ds-font-line-body)'],
        'design-sm': ['var(--ds-font-size-sm)', 'var(--ds-font-line-body)'],
        'design-base': ['var(--ds-font-size-base)', 'var(--ds-font-line-body)'],
        'design-lg': ['var(--ds-font-size-lg)', 'var(--ds-font-line-body)'],
        'design-xl': ['var(--ds-font-size-xl)', 'var(--ds-font-line-tight)'],
        'design-2xl': ['var(--ds-font-size-2xl)', 'var(--ds-font-line-tight)'],
        'design-3xl': ['var(--ds-font-size-3xl)', 'var(--ds-font-line-tight)'],
      },
      fontFamily: {
        'sans': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        editorial: ['var(--ds-font-family-editorial)'],
        mono: ['var(--ds-font-family-mono)'],
        ui: ['var(--ds-font-family-ui)'],
      },
      colors: parseColorMatrix({
        // Define color matrix (of available colors)
        // Colors are configured at runtime with CSS variables in soapbox.json
        gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        primary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        success: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        danger: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        accent: [300, 500],
        'gradient-start': true,
        'gradient-end': true,
        'sea-blue': true,
      }),
      backgroundColor: {
        'design-canvas': 'var(--ds-color-canvas)',
        'design-canvas-elevated': 'var(--ds-color-canvas-elevated)',
        'design-surface-primary': 'var(--ds-color-surface-primary)',
        'design-surface-secondary': 'var(--ds-color-surface-secondary)',
        'design-selected': 'var(--ds-color-selected)',
      },
      borderColor: {
        'design-separator': 'var(--ds-color-separator)',
        'design-focus': 'var(--ds-color-focus-ring)',
      },
      borderRadius: Object.fromEntries(
        Object.keys(designTokens.primitives.radius)
          .map(name => [`design-${name}`, `var(--ds-radius-${name})`]),
      ),
      spacing: Object.fromEntries(
        Object.keys(designTokens.primitives.space)
          .map(name => [`design-${name}`, `var(--ds-space-${name})`]),
      ),
      textColor: {
        'design-primary': 'var(--ds-color-text-primary)',
        'design-secondary': 'var(--ds-color-text-secondary)',
        'design-tertiary': 'var(--ds-color-text-tertiary)',
        'design-accent': 'var(--ds-color-accent)',
        'design-positive': 'var(--ds-color-positive)',
        'design-caution': 'var(--ds-color-caution)',
        'design-destructive': 'var(--ds-color-destructive)',
        'design-information': 'var(--ds-color-information)',
      },
      transitionDuration: {
        fast: 'var(--ds-motion-duration-fast)',
        standard: 'var(--ds-motion-duration-standard)',
        slow: 'var(--ds-motion-duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--ds-motion-easing-standard)',
        emphasized: 'var(--ds-motion-easing-emphasized)',
      },
      animation: {
        'fadein': 'fadein 0.5s ease-in-out',
        'sonar-scale-4': 'sonar-scale-4 3s linear infinite',
        'sonar-scale-3': 'sonar-scale-3 3s 0.5s linear infinite',
        'sonar-scale-2': 'sonar-scale-2 3s 1s linear infinite',
        'sonar-scale-1': 'sonar-scale-1 3s 1.5s linear infinite',
      },
      keyframes: {
        'fadein': {
          '0%': { opacity: 0 },
          '25%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'sonar-scale-4': {
          from: { opacity: '0.4' },
          to: { opacity: 0, transform: 'scale(4)' },
        },
        'sonar-scale-3': {
          from: { opacity: '0.4' },
          to: { opacity: 0, transform: 'scale(3.5)' },
        },
        'sonar-scale-2': {
          from: { opacity: '0.4' },
          to: { opacity: 0, transform: 'scale(3)' },
        },
        'sonar-scale-1': {
          from: { opacity: '0.4' },
          to: { opacity: 0, transform: 'scale(2.5)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
