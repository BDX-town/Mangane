/*
MIT License

Copyright (c) 2022 Javis V. Pérez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Adapted from:
// https://github.com/javisperez/tailwindcolorshades/blob/master/src/composables/colors.ts

import type { Rgb, TailwindColorObject } from 'soapbox/types/colors';

export function hexToRgb(hex: string): Rgb | null {
  const sanitizedHex = hex.replace(/##/g, '#');
  const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    sanitizedHex,
  );

  if (!colorParts) {
    return null;
  }

  const [, r, g, b] = colorParts;

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16),
  } as Rgb;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getTextColor(color: string): '#FFF' | '#333' {
  const rgbColor = hexToRgb(color);

  if (!rgbColor) {
    return '#333';
  }

  const { r, g, b } = rgbColor;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luma < 120 ? '#FFF' : '#333';
}

function lighten(hex: string, intensity: number): string {
  const color = hexToRgb(`#${hex}`);

  if (!color) {
    return '';
  }

  const r = Math.round(color.r + (255 - color.r) * intensity);
  const g = Math.round(color.g + (255 - color.g) * intensity);
  const b = Math.round(color.b + (255 - color.b) * intensity);

  return rgbToHex(r, g, b);
}

function darken(hex: string, intensity: number): string {
  const color = hexToRgb(hex);

  if (!color) {
    return '';
  }

  const r = Math.round(color.r * intensity);
  const g = Math.round(color.g * intensity);
  const b = Math.round(color.b * intensity);

  return rgbToHex(r, g, b);
}

export default function(baseColor: string): TailwindColorObject {
  const response: TailwindColorObject = {
    500: `#${baseColor}`.replace(/##/g, '#'),
  };

  const intensityMap: {
    [key: number]: number;
  } = {
    50: 0.95,
    100: 0.9,
    200: 0.75,
    300: 0.3,
    400: 0.2,
    600: 0.9,
    700: 0.75,
    800: 0.3,
    900: 0.19,
  };

  [50, 100, 200, 300, 400].forEach(level => {
    response[level] = lighten(baseColor, intensityMap[level]);
  });

  [600, 700, 800, 900].forEach(level => {
    response[level] = darken(baseColor, intensityMap[level]);
  });

  return response;
}
