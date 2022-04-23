import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import { ME_FETCH_SUCCESS } from 'soapbox/actions/me';

import { EMOJI_USE } from '../actions/emojis';
import { GIF_FAV, GIF_UNFAV } from '../actions/gifs';
import { NOTIFICATIONS_FILTER_SET } from '../actions/notifications';
import { SEARCH_FILTER_SET } from '../actions/search';
import {
  SETTING_CHANGE,
  SETTING_SAVE,
  SETTINGS_UPDATE,
  FE_NAME,
} from '../actions/settings';

// Default settings are in action/settings.js
//
// Settings should be accessed with `getSettings(getState()).getIn(...)`
// instead of directly from the state.
const initialState = ImmutableMap({
  saved: true,
});

const updateFrequentEmojis = (state, emoji) => state.update('frequentlyUsedEmojis', ImmutableMap(), map => map.update(emoji.id, 0, count => count + 1)).set('saved', false);
const favGIFs = (state, gif) => state.update('favGIFs', ImmutableList(), list => list.push(gif)).set('saved', false);
const unfavGIFs = (state, gif) => state.update('favGIFs', ImmutableList(), list => list.filter((g) => g.url != gif.url)).set('saved', false);

const importSettings = (state, account) => {
  account = fromJS(account);
  const prefs = account.getIn(['pleroma', 'settings_store', FE_NAME], ImmutableMap());
  return state.merge(prefs);
};

export default function settings(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
    return importSettings(state, action.me);
  case NOTIFICATIONS_FILTER_SET:
  case SEARCH_FILTER_SET:
  case SETTING_CHANGE:
    return state
      .setIn(action.path, action.value)
      .set('saved', false);
  case EMOJI_USE:
    return updateFrequentEmojis(state, action.emoji);
  case GIF_FAV:
    return favGIFs(state, action.gif);
  case GIF_UNFAV:
    return unfavGIFs(state, action.gif);
  case SETTING_SAVE:
    return state.set('saved', true);
  case SETTINGS_UPDATE:
    return fromJS(action.settings);
  default:
    return state;
  }
}
