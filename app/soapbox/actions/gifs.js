import { saveSettings } from './settings';

export const GIF_FAV = 'GIF_FAV';
export const GIF_UNFAV = 'GIF_UNFAV';

export function favGIF(gif) {
  return dispatch => {
    dispatch({
      type: GIF_FAV,
      gif,
    });

    dispatch(saveSettings());
  };
}

export function unfavGIF(gif) {
  return dispatch => {
    dispatch({
      type: GIF_UNFAV,
      gif,
    });

    dispatch(saveSettings());
  };
}

