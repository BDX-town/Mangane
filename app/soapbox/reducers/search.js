import {
  SEARCH_CHANGE,
  SEARCH_CLEAR,
  SEARCH_FETCH_REQUEST,
  SEARCH_FETCH_SUCCESS,
  SEARCH_SHOW,
  SEARCH_FILTER_SET,
  SEARCH_EXPAND_SUCCESS,
} from '../actions/search';
import {
  COMPOSE_MENTION,
  COMPOSE_REPLY,
  COMPOSE_DIRECT,
} from '../actions/compose';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  value: '',
  submitted: false,
  submittedValue: '',
  hidden: false,
  results: ImmutableMap(),
  filter: 'accounts',
});

export default function search(state = initialState, action) {
  switch(action.type) {
  case SEARCH_CHANGE:
    return state.withMutations(map => {
      map.set('value', action.value);
      map.set('submitted', false);
    });
  case SEARCH_CLEAR:
    return state.withMutations(map => {
      map.set('value', '');
      map.set('results', ImmutableMap());
      map.set('submitted', false);
      map.set('hidden', false);
      map.set('filter', 'accounts');
    });
  case SEARCH_SHOW:
    return state.set('hidden', false);
  case COMPOSE_REPLY:
  case COMPOSE_MENTION:
  case COMPOSE_DIRECT:
    return state.set('hidden', true);
  case SEARCH_FETCH_REQUEST:
    return state.withMutations(map => {
      map.set('results', ImmutableMap());
      map.set('submitted', true);
      map.set('submittedValue', action.value);
    });
  case SEARCH_FETCH_SUCCESS:
    return state.set('results', ImmutableMap({
      accounts: ImmutableList(action.results.accounts.map(item => item.id)),
      statuses: ImmutableList(action.results.statuses.map(item => item.id)),
      hashtags: fromJS(action.results.hashtags),
      accountsHasMore: action.results.accounts.length >= 20,
      statusesHasMore: action.results.statuses.length >= 20,
      hashtagsHasMore: action.results.hashtags.length >= 20,
    })).set('submitted', true).set('filter', action.results.accounts.length > 0
      ? 'accounts'
      : action.results.statuses.length > 0
        ? 'statuses'
        : action.results.hashtags.length > 0
          ? 'hashtags'
          : 'accounts');
  case SEARCH_FILTER_SET:
    return state.set('filter', action.value);
  case SEARCH_EXPAND_SUCCESS:
    return state.withMutations((state) => {
      state.setIn(['results', `${action.searchType}HasMore`], action.results[action.searchType].length >= 20);
      state.updateIn(['results', action.searchType], list => list.concat(action.results[action.searchType].map(item => item.id)));
    });
  default:
    return state;
  }
}
