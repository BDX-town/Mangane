import { saveSettings } from './settings';

import type { Emoji } from 'soapbox/components/autosuggest_emoji';
import type { AppDispatch } from 'soapbox/store';

const EMOJI_USE = 'EMOJI_USE';

const useEmoji = (emoji: Emoji) =>
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
