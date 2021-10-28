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
import {
  COMPOSE_MENTION,
  COMPOSE_REPLY,
  COMPOSE_DIRECT,
} from '../actions/compose';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet, fromJS } from 'immutable';

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

const getResultsFilter = results => {
  if (results.accounts.length > 0) {
    return 'accounts';
  } else if (results.statuses.length > 0) {
    return 'statuses';
  } else if (results.hashtags.length > 0) {
    return 'hashtags';
  } else {
    return 'accounts';
  }
};

const importResults = (state, results) => {
  const filter = getResultsFilter(results);

  return state.withMutations(state => {
    state.set('results', ImmutableMap({
      accounts: toIds(results.accounts),
      statuses: toIds(results.accounts),
      hashtags: fromJS(results.hashtags), // it's a list of maps
      accountsHasMore: results.accounts.length >= 20,
      statusesHasMore: results.statuses.length >= 20,
      hashtagsHasMore: results.hashtags.length >= 20,
      accountsLoaded: true,
      statusesLoaded: true,
      hashtagsLoaded: true,
    }));

    state.set('submitted', true);
    state.set('filter', filter);
  });
};

const paginateResults = (state, searchType, results) => {
  return state.withMutations(state => {
    state.setIn(['results', `${searchType}HasMore`], results[searchType].length >= 20);
    state.setIn(['results', `${searchType}Loaded`], true);
    state.updateIn(['results', searchType], items => items.concat(results[searchType].map(item => item.id)));
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
  switch(action.type) {
  case SEARCH_CHANGE:
    return state.set('value', action.value);
  case SEARCH_CLEAR:
    return initialState;
  case SEARCH_SHOW:
    return state.set('hidden', false);
  case COMPOSE_REPLY:
  case COMPOSE_MENTION:
  case COMPOSE_DIRECT:
    return state.set('hidden', true);
  case SEARCH_FETCH_REQUEST:
    return handleSubmitted(state, action.value);
  case SEARCH_FETCH_SUCCESS:
    return importResults(state, action.results);
  case SEARCH_FILTER_SET:
    return state.set('filter', action.value);
  case SEARCH_EXPAND_REQUEST:
    return state.setIn(['results', `${action.searchType}Loaded`], false);
  case SEARCH_EXPAND_SUCCESS:
    return paginateResults(state, action.searchType, action.results);
  default:
    return state;
  }
}
