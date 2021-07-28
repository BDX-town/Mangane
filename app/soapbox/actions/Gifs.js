export const GIF_USE = 'GIF_USE';

export function useGIF(gif) {
  return dispatch => {
    dispatch({
      type: GIF_USE,
      gif,
    });
  };
};
