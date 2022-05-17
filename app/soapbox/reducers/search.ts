import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
  fromJS,
} from 'immutable';

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

import type { AnyAction } from 'redux';

export const ReducerRecord = ImmutableRecord({
  value: '',
  submitted: false,
  submittedValue: '',
  hidden: false,
  results: ImmutableMap<string, any>(),
  filter: 'accounts',
});

type State = ReturnType<typeof ReducerRecord>;

type IdEntity = { id: string };
type SearchType = 'accounts' | 'statuses' | 'hashtags';

type Results = {
  accounts: IdEntity[],
  statuses: IdEntity[],
  hashtags: Record<string, any>[],
}

const toIds = (items: IdEntity[]) => {
  return ImmutableOrderedSet(items.map(item => item.id));
};

const importResults = (state: State, results: Results, searchTerm: string, searchType: SearchType): State => {
  return state.withMutations(state => {
    if (state.get('value') === searchTerm && state.get('filter') === searchType) {
      state.set('results', ImmutableMap({
        accounts: toIds(results.accounts),
        statuses: toIds(results.statuses),
        hashtags: ImmutableList(results.hashtags.map(ImmutableMap)), // it's a list of maps
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

const paginateResults = (state: State, searchType: SearchType, results: Results, searchTerm: string): State => {
  return state.withMutations(state => {
    if (state.value === searchTerm) {
      state.setIn(['results', `${searchType}HasMore`], results[searchType].length >= 20);
      state.setIn(['results', `${searchType}Loaded`], true);
      state.updateIn(['results', searchType], items => {
        const data = results[searchType];
        // Hashtags are a list of maps. Others are IDs.
        if (searchType === 'hashtags') {
          // @ts-ignore
          return items.concat(fromJS(data));
        } else {
          // @ts-ignore
          return items.concat(toIds(data));
        }
      });
    }
  });
};

const handleSubmitted = (state: State, value: string): State => {
  return state.withMutations(state => {
    state.set('results', ImmutableMap());
    state.set('submitted', true);
    state.set('submittedValue', value);
  });
};

export default function search(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case SEARCH_CHANGE:
      return state.set('value', action.value);
    case SEARCH_CLEAR:
      return ReducerRecord();
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
