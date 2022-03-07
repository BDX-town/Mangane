// https://tailwindcss.com/docs/customizing-colors#using-css-variables
function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

// Parse list of shades into Tailwind function with CSS variables
const parseShades = (color, shades) => {
  return shades.reduce((obj, shade) => {
    obj[shade] = withOpacityValue(`--color-${color}-${shade}`);
    return obj;
  }, {});
};

// Parse color matrix into Tailwind colors object
const parseColors = colors => {
  return Object.keys(colors).reduce((obj, color) => {
    obj[color] = parseShades(color, colors[color]);
    return obj;
  }, {});
};

// Define color matrix (of available colors)
const colors = {
  gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  primary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  success: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  danger: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  accent: [300, 500],
};

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
      colors: Object.assign(parseColors(colors), {
        'gradient-purple': withOpacityValue('--color-gradient-purple'),
        'gradient-blue': withOpacityValue('--color-gradient-blue'),
        'sea-blue': withOpacityValue('--color-sea-blue'),
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
