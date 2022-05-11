import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable';

import { FILTERS_FETCH_SUCCESS } from '../actions/filters';

import type { AnyAction } from 'redux';

type Filter = ImmutableMap<string, any>;
type State = ImmutableList<Filter>;

const importFilters = (_state: State, filters: unknown): State => {
  return ImmutableList(fromJS(filters)).map(filter => ImmutableMap(fromJS(filter)));
};

export default function filters(state: State = ImmutableList<Filter>(), action: AnyAction): State {
  switch (action.type) {
    case FILTERS_FETCH_SUCCESS:
      return importFilters(state, action.filters);
    default:
      return state;
  }
}
