import { saveSettings } from './settings';

import type { AppDispatch } from 'soapbox/store';

const EMOJI_USE = 'EMOJI_USE';

const useEmoji = (emoji: string) =>
  (dispatch: AppDispatch) => {
    dispatch({
      type: EMOJI_USE,
      emoji,
    });

    dispatch(saveSettings());
  };

export {
  EMOJI_USE,
  useEmoji,
};
