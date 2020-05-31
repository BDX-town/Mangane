export const THEME_SET = 'THEME_SET';
export const THEME_GENERATE = 'THEME_GENERATE';

export function generateTheme(brandColor, mode) {
  return {
    type: THEME_GENERATE,
    brandColor,
    mode,
  };
}

export function setTheme(themeData) {
  return {
    type: THEME_SET,
    themeData,
  };
}
