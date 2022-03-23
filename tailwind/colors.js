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
const parseColorMatrix = colors => {
  return Object.keys(colors).reduce((obj, color) => {
    obj[color] = parseShades(color, colors[color]);
    return obj;
  }, {});
};

module.exports = {
  withOpacityValue,
  parseColorMatrix,
};
