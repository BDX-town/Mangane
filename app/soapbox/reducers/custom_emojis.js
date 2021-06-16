import { List as ImmutableList, fromJS } from 'immutable';
import { CUSTOM_EMOJIS_FETCH_SUCCESS } from '../actions/custom_emojis';
import { emojis as emojiData } from 'soapbox/features/emoji/emoji_mart_data_light';

const initialState = ImmutableList();

const importEmojis = (state, emojis) => {
  return fromJS(emojis).filter(emoji => {
    // If a custom emoji has the shortcode of a Unicode emoji, skip it.
    // Otherwise it breaks EmojiMart.
    // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/610
    const shortcode = emoji.get('shortcode', '').toLowerCase();
    return !emojiData[shortcode];
  });
};

export default function custom_emojis(state = initialState, action) {
  if (action.type === CUSTOM_EMOJIS_FETCH_SUCCESS) {
    return importEmojis(state, action.custom_emojis);
  }

  return state;
};
