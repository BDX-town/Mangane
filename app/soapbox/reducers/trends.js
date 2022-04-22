import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  TRENDS_FETCH_REQUEST,
  TRENDS_FETCH_SUCCESS,
  TRENDS_FETCH_FAIL,
} from '../actions/trends';

const initialState = ImmutableMap({
  items: ImmutableList(),
  isLoading: false,
});

export default function trendsReducer(state = initialState, action) {
  switch(action.type) {
  case TRENDS_FETCH_REQUEST:
    return state.set('isLoading', true);
  case TRENDS_FETCH_SUCCESS:
    return state.withMutations(map => {
      map.set('items', fromJS(action.tags.map((x => x))));
      map.set('isLoading', false);
    });
  case TRENDS_FETCH_FAIL:
    return state.set('isLoading', false);
  default:
    return state;
  }
}
