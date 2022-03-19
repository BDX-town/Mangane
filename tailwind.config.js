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
      colors: {
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
