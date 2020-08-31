import { SETTING_CHANGE, SETTING_SAVE, FE_NAME } from '../actions/settings';
import { NOTIFICATIONS_FILTER_SET } from '../actions/notifications';
import { STORE_HYDRATE } from '../actions/store';
import { EMOJI_USE } from '../actions/emojis';
import { LIST_DELETE_SUCCESS, LIST_FETCH_FAIL } from '../actions/lists';
import { ME_FETCH_SUCCESS } from 'soapbox/actions/me';
import { Map as ImmutableMap, fromJS } from 'immutable';
import uuid from '../uuid';

// Default settings are in action/settings.js
//
// Settings should be accessed with `getSettings(getState()).getIn(...)`
// instead of directly from the state.
const initialState = ImmutableMap({
  saved: true,
});

const defaultColumns = fromJS([
  { id: 'COMPOSE', uuid: uuid(), params: {} },
  { id: 'HOME', uuid: uuid(), params: {} },
  { id: 'NOTIFICATIONS', uuid: uuid(), params: {} },
]);

const hydrate = (state, settings) => state.mergeDeep(settings).update('columns', (val = defaultColumns) => val);

const updateFrequentEmojis = (state, emoji) => state.update('frequentlyUsedEmojis', ImmutableMap(), map => map.update(emoji.id, 0, count => count + 1)).set('saved', false);

const filterDeadListColumns = (state, listId) => state.update('columns', columns => columns.filterNot(column => column.get('id') === 'LIST' && column.get('params').get('id') === listId));

export default function settings(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return hydrate(state, action.state.get('settings'));
  case ME_FETCH_SUCCESS:
    const me = fromJS(action.me);
    let fePrefs = me.getIn(['pleroma', 'settings_store', FE_NAME], ImmutableMap());
    return state.merge(fePrefs);
  case NOTIFICATIONS_FILTER_SET:
  case SETTING_CHANGE:
    return state
      .setIn(action.path, action.value)
      .set('saved', false);
  case EMOJI_USE:
    return updateFrequentEmojis(state, action.emoji);
  case SETTING_SAVE:
    return state.set('saved', true);
  case LIST_FETCH_FAIL:
    return action.error.response.status === 404 ? filterDeadListColumns(state, action.id) : state;
  case LIST_DELETE_SUCCESS:
    return filterDeadListColumns(state, action.id);
  default:
    return state;
  }
};
