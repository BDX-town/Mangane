import { SETTING_CHANGE, SETTING_SAVE, FE_NAME } from '../actions/settings';
import { NOTIFICATIONS_FILTER_SET } from '../actions/notifications';
import { SEARCH_FILTER_SET } from '../actions/search';
import { EMOJI_USE } from '../actions/emojis';
import { ME_FETCH_SUCCESS } from 'soapbox/actions/me';
import { Map as ImmutableMap, fromJS } from 'immutable';

// Default settings are in action/settings.js
//
// Settings should be accessed with `getSettings(getState()).getIn(...)`
// instead of directly from the state.
const initialState = ImmutableMap({
  saved: true,
});

const updateFrequentEmojis = (state, emoji) => state.update('frequentlyUsedEmojis', ImmutableMap(), map => map.update(emoji.id, 0, count => count + 1)).set('saved', false);

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
  case SETTING_SAVE:
    return state.set('saved', true);
  default:
    return state;
  }
}
