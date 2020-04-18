import {
  MASTO_PREFS_FETCH_SUCCESS,
  PREFERENCE_CHANGE,
  PREFERENCE_SAVE,
  FE_NAME,
} from 'gabsocial/actions/preferences';
import { ME_FETCH_SUCCESS } from 'gabsocial/actions/me';

import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap({
  saved: true,
  posting: ImmutableMap({
    default: ImmutableMap({
      visibility: 'public',
      sensitive: false,
      language: null,
    }),
  }),
  reading: ImmutableMap({
    expand: ImmutableMap({
      media: 'default',
      spoilers: false,
    }),
  }),
  auto_play_gif: false,
  theme: 'lime',
});

export function mastoPrefsToMap(prefs) {
  let map = ImmutableMap();
  for (const [key, value] of Object.entries(prefs)) {
    map = map.setIn(key.split(':'), value);
  }
  return map;
}

export default function preferences(state = initialState, action) {
  switch(action.type) {
  case MASTO_PREFS_FETCH_SUCCESS:
    return state.merge(mastoPrefsToMap(action.prefs));
  case ME_FETCH_SUCCESS:
    const me = fromJS(action.me);
    const fePrefs = me.getIn(['pleroma', 'settings_store', FE_NAME]);
    return state.merge(fePrefs);
  case PREFERENCE_CHANGE:
    return state
      .setIn(action.path, action.value)
      .set('saved', false);
  case PREFERENCE_SAVE:
    return state.set('saved', true);
  default:
    return state;
  }
}
