import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

import {
  ALIASES_SUGGESTIONS_READY,
  ALIASES_SUGGESTIONS_CLEAR,
  ALIASES_SUGGESTIONS_CHANGE,
  ALIASES_FETCH_SUCCESS,
} from '../actions/aliases';

const initialState = ImmutableMap({
  aliases: ImmutableMap({
    loaded: false,
    items: ImmutableList(),
  }),
  suggestions: ImmutableMap({
    value: '',
    loaded: false,
    items: ImmutableList(),
  }),
});

export default function aliasesReducer(state = initialState, action) {
  switch (action.type) {
    case ALIASES_FETCH_SUCCESS:
      return state
        .setIn(['aliases', 'items'], action.value);
    case ALIASES_SUGGESTIONS_CHANGE:
      return state
        .setIn(['suggestions', 'value'], action.value)
        .setIn(['suggestions', 'loaded'], false);
    case ALIASES_SUGGESTIONS_READY:
      return state
        .setIn(['suggestions', 'items'], ImmutableList(action.accounts.map(item => item.id)))
        .setIn(['suggestions', 'loaded'], true);
    case ALIASES_SUGGESTIONS_CLEAR:
      return state.update('suggestions', suggestions => suggestions.withMutations(map => {
        map.set('items', ImmutableList());
        map.set('value', '');
        map.set('loaded', false);
      }));
    default:
      return state;
  }
}
