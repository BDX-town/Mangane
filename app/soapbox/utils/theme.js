import { Map as ImmutableMap } from 'immutable';

export const generateThemeCss = brandColor => {
  if (!brandColor) return null;
  return themeDataToCss(brandColorToThemeData(brandColor));
};

// https://stackoverflow.com/a/5624139
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => (
    r + r + g + g + b + b
  ));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : {
    // fall back to Azure
    r: 4,
    g: 130,
    b: 216,
  };
}

// Taken from chromatism.js
// https://github.com/graypegg/chromatism/blob/master/src/conversions/rgb.js
const rgbToHsl = value => {
  const r = value.r / 255;
  const g = value.g / 255;
  const b = value.b / 255;
  const rgbOrdered = [ r, g, b ].sort();
  const l = ((rgbOrdered[0] + rgbOrdered[2]) / 2) * 100;
  let s, h;
  if (rgbOrdered[0] === rgbOrdered[2]) {
    s = 0;
    h = 0;
  } else {
    if (l >= 50) {
      s = ((rgbOrdered[2] - rgbOrdered[0]) / ((2.0 - rgbOrdered[2]) - rgbOrdered[0])) * 100;
    } else {
      s = ((rgbOrdered[2] - rgbOrdered[0]) / (rgbOrdered[2] + rgbOrdered[0])) * 100;
    }
    if (rgbOrdered[2] === r) {
      h = ((g - b) / (rgbOrdered[2] - rgbOrdered[0])) * 60;
    } else if (rgbOrdered[2] === g) {
      h = (2 + ((b - r) / (rgbOrdered[2] - rgbOrdered[0]))) * 60;
    } else {
      h = (4 + ((r - g) / (rgbOrdered[2] - rgbOrdered[0]))) * 60;
    }
    if (h < 0) {
      h += 360;
    } else if (h > 360) {
      h = h % 360;
    }
  }

  return {
    h: h,
    s: s,
    l: l,
  };
};

export const brandColorToThemeData = brandColor => {
  const { h, s, l } = rgbToHsl(hexToRgb(brandColor));
  return ImmutableMap({
    'brand-color_h': h,
    'brand-color_s': `${s}%`,
    'brand-color_l': `${l}%`,
  });
};

export const themeDataToCss = themeData => (
  themeData
    .entrySeq()
    .reduce((acc, cur) => acc + `--${cur[0]}:${cur[1]};`, '')
);

export const brandColorToCSS = brandColor => themeDataToCss(brandColorToThemeData(brandColor));
