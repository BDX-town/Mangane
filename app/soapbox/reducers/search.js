import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet, fromJS } from 'immutable';

import {
  COMPOSE_MENTION,
  COMPOSE_REPLY,
  COMPOSE_DIRECT,
  COMPOSE_QUOTE,
} from '../actions/compose';
import {
  SEARCH_CHANGE,
  SEARCH_CLEAR,
  SEARCH_FETCH_REQUEST,
  SEARCH_FETCH_SUCCESS,
  SEARCH_SHOW,
  SEARCH_FILTER_SET,
  SEARCH_EXPAND_REQUEST,
  SEARCH_EXPAND_SUCCESS,
} from '../actions/search';

const initialState = ImmutableMap({
  value: '',
  submitted: false,
  submittedValue: '',
  hidden: false,
  results: ImmutableMap(),
  filter: 'accounts',
});

const toIds = items => {
  return ImmutableOrderedSet(items.map(item => item.id));
};

const importResults = (state, results, searchTerm, searchType) => {
  return state.withMutations(state => {
    if (state.get('value') === searchTerm && state.get('filter') === searchType) {
      state.set('results', ImmutableMap({
        accounts: toIds(results.accounts),
        statuses: toIds(results.statuses),
        hashtags: fromJS(results.hashtags), // it's a list of maps
        accountsHasMore: results.accounts.length >= 20,
        statusesHasMore: results.statuses.length >= 20,
        hashtagsHasMore: results.hashtags.length >= 20,
        accountsLoaded: true,
        statusesLoaded: true,
        hashtagsLoaded: true,
      }));

      state.set('submitted', true);
    }
  });
};

const paginateResults = (state, searchType, results, searchTerm) => {
  return state.withMutations(state => {
    if (state.get('value') === searchTerm) {
      state.setIn(['results', `${searchType}HasMore`], results[searchType].length >= 20);
      state.setIn(['results', `${searchType}Loaded`], true);
      state.updateIn(['results', searchType], items => {
        const data = results[searchType];
        // Hashtags are a list of maps. Others are IDs.
        if (searchType === 'hashtags') {
          return items.concat(fromJS(data));
        } else {
          return items.concat(toIds(data));
        }
      });
    }
  });
};

const handleSubmitted = (state, value) => {
  return state.withMutations(state => {
    state.set('results', ImmutableMap());
    state.set('submitted', true);
    state.set('submittedValue', value);
  });
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case SEARCH_CHANGE:
      return state.set('value', action.value);
    case SEARCH_CLEAR:
      return initialState;
    case SEARCH_SHOW:
      return state.set('hidden', false);
    case COMPOSE_REPLY:
    case COMPOSE_MENTION:
    case COMPOSE_DIRECT:
    case COMPOSE_QUOTE:
      return state.set('hidden', true);
    case SEARCH_FETCH_REQUEST:
      return handleSubmitted(state, action.value);
    case SEARCH_FETCH_SUCCESS:
      return importResults(state, action.results, action.searchTerm, action.searchType);
    case SEARCH_FILTER_SET:
      return state.set('filter', action.value);
    case SEARCH_EXPAND_REQUEST:
      return state.setIn(['results', `${action.searchType}Loaded`], false);
    case SEARCH_EXPAND_SUCCESS:
      return paginateResults(state, action.searchType, action.results, action.searchTerm);
    default:
      return state;
  }
}
