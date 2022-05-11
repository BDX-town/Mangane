const { parseColorMatrix } = require('./tailwind/colors');

module.exports = {
  content: ['./app/**/*.{html,js,ts,tsx}', './custom/instance/**/*.html'],
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
        'gradient-start': true,
        'gradient-end': true,
        'sea-blue': true,
      }),
      animation: {
        'sonar-scale-4': 'sonar-scale-4 3s linear infinite',
        'sonar-scale-3': 'sonar-scale-3 3s 0.5s linear infinite',
        'sonar-scale-2': 'sonar-scale-2 3s 1s linear infinite',
        'sonar-scale-1': 'sonar-scale-1 3s 1.5s linear infinite',
      },
      keyframes: {
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
