const { parseColorMatrix } = require('./tailwind/colors');

module.exports = {
  content: ['./app/**/*.{html,js,ts,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '581px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      fontSize: {
        base: '0.9375rem',
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
      },
      colors: parseColorMatrix({
        // Define color matrix (of available colors)
        // Colors are configured at runtime with CSS variables in soapbox.json
        gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        primary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        success: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        danger: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        accent: [300, 500],
        'gradient-purple': true,
        'gradient-blue': true,
        'sea-blue': true,
        'bg-shape-1': true,
        'bg-shape-2': true,
      }),
      animation: {
        'pulse-scale-4': 'pulse-scale-4 3s linear infinite',
        'pulse-scale-3': 'pulse-scale-3 3s 0.5s linear infinite',
        'pulse-scale-2': 'pulse-scale-2 3s 1s linear infinite',
        'pulse-scale-1': 'pulse-scale-1 3s 1.5s linear infinite',
      },
      keyframes: {
        'pulse-scale-4': {
          from: { opacity: '0.4' },
          to: { opacity: 0, transform: 'scale(4)' },
        },
        'pulse-scale-3': {
          from: { opacity: '0.4' },
          to: { opacity: 0, transform: 'scale(3.5)' },
        },
        'pulse-scale-2': {
          from: { opacity: '0.4' },
          to: { opacity: 0, transform: 'scale(3)' },
        },
        'pulse-scale-1': {
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
