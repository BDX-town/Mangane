import { List as ImmutableList, Map as ImmutableMap, fromJS } from 'immutable';

import { emojis as emojiData } from 'soapbox/features/emoji/emoji_mart_data_light';
import { addCustomToPool } from 'soapbox/features/emoji/emoji_mart_search_light';

import { CUSTOM_EMOJIS_FETCH_SUCCESS } from '../actions/custom_emojis';
import { buildCustomEmojis } from '../features/emoji/emoji';

import type { AnyAction } from 'redux';
import type { APIEntity } from 'soapbox/types/entities';

const initialState = ImmutableList();

// Populate custom emojis for composer autosuggest
const autosuggestPopulate = (emojis: ImmutableList<ImmutableMap<string, string>>) => {
  addCustomToPool(buildCustomEmojis(emojis));
};

const importEmojis = (customEmojis: APIEntity[]) => {
  const emojis = (fromJS(customEmojis) as ImmutableList<ImmutableMap<string, string>>).filter((emoji) => {
    // If a custom emoji has the shortcode of a Unicode emoji, skip it.
    // Otherwise it breaks EmojiMart.
    // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/610
    const shortcode = emoji.get('shortcode', '').toLowerCase();
    return !emojiData[shortcode];
  });

  autosuggestPopulate(emojis);
  return emojis;
};

export default function custom_emojis(state = initialState, action: AnyAction) {
  if (action.type === CUSTOM_EMOJIS_FETCH_SUCCESS) {
    return importEmojis(action.custom_emojis);
  }

  return state;
}
