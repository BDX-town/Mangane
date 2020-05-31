export const SET_THEME = 'SET_THEME';

export function setTheme(themeData) {
  return {
    type: SET_THEME,
    themeData,
  };
}
