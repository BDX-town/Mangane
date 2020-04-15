export const SET_THEME = 'SET_THEME';

export function setTheme(theme) {
  return (dispatch, getState) => {
    dispatch({ type: SET_THEME, theme });
  };
}
