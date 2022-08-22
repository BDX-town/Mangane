import { hexToRgb } from './colors';

import type { Rgb, Hsl, TailwindColorPalette, TailwindColorObject } from 'soapbox/types/colors';
import type { SoapboxConfig } from 'soapbox/types/soapbox';

// Taken from chromatism.js
// https://github.com/graypegg/chromatism/blob/master/src/conversions/rgb.js
const rgbToHsl = (value: Rgb): Hsl => {
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

// https://stackoverflow.com/a/44134328
function hslToHex(color: Hsl): string {
  const { h, s } = color;
  let { l } = color;

  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate accent color from brand color
export const generateAccent = (brandColor: string): string | null => {
  const rgb = hexToRgb(brandColor);
  if (!rgb) return null;

  const { h } = rgbToHsl(rgb);
  return hslToHex({ h: h - 15, s: 86, l: 44 });
};

const parseShades = (obj: Record<string, any>, color: string, shades: Record<string, any>): void => {
  if (!shades) return;

  if (typeof shades === 'string') {
    const rgb = hexToRgb(shades);
    if (!rgb) return;

    const { r, g, b } = rgb;
    obj[`--color-${color}`] = `${r} ${g} ${b}`;
    return;
  }

  Object.keys(shades).forEach(shade => {
    const rgb = hexToRgb(shades[shade]);
    if (!rgb) return;

    const { r, g, b } = rgb;
    obj[`--color-${color}-${shade}`] = `${r} ${g} ${b}`;
  });
};

// Convert colors as CSS variables
const parseColors = (colors: TailwindColorPalette): TailwindColorPalette => {
  return Object.keys(colors).reduce((obj, color) => {
    parseShades(obj, color, colors[color] as TailwindColorObject);
    return obj;
  }, {});
};

export const colorsToCss = (colors: TailwindColorPalette): string => {
  const parsed = parseColors(colors);
  return Object.keys(parsed).reduce((css, variable) => {
    return css + `${variable}:${parsed[variable]};`;
  }, '');
};

export const generateThemeCss = (soapboxConfig: SoapboxConfig): string => {
  return colorsToCss(soapboxConfig.colors.toJS() as TailwindColorPalette);
};
