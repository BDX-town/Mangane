import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
  List as ImmutableList,
} from 'immutable';

import {
  TRENDS_FETCH_REQUEST,
  TRENDS_FETCH_SUCCESS,
  TRENDS_FETCH_FAIL,
} from '../actions/trends';

import type { AnyAction } from 'redux';

const ReducerRecord = ImmutableRecord({
  items: ImmutableList<ImmutableMap<string, any>>(),
  isLoading: false,
});

export default function trendsReducer(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case TRENDS_FETCH_REQUEST:
      return state.set('isLoading', true);
    case TRENDS_FETCH_SUCCESS:
      return state.withMutations(map => {
        map.set('items', ImmutableList(action.tags.map(ImmutableMap)));
        map.set('isLoading', false);
      });
    case TRENDS_FETCH_FAIL:
      return state.set('isLoading', false);
    default:
      return state;
  }
}
