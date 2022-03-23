// https://tailwindcss.com/docs/customizing-colors#using-css-variables
function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

// Parse a single color as a CSS variable
const toColorVariable = (colorName, tint = null) => {
  const suffix = tint ? `-${tint}` : '';
  const variable = `--color-${colorName}${suffix}`;

  return withOpacityValue(variable);
};

// Parse list of tints into Tailwind function with CSS variables
const parseTints = (colorName, tints) => {
  return tints.reduce((colorObj, tint) => {
    colorObj[tint] = toColorVariable(colorName, tint);
    return colorObj;
  }, {});
};

// Parse color matrix into Tailwind color palette
const parseColorMatrix = colorMatrix => {
  return Object.entries(colorMatrix).reduce((palette, colorData) => {
    const [colorName, tints] = colorData;

    // Conditionally parse array or single-tint colors
    if (Array.isArray(tints)) {
      palette[colorName] = parseTints(colorName, tints);
    } else if (tints === true) {
      palette[colorName] = toColorVariable(colorName);
    }

    return palette;
  }, {});
};

module.exports = {
  withOpacityValue,
  parseColorMatrix,
};
