import { List as ImmutableList } from 'immutable';

import { normalizeFilter } from 'soapbox/normalizers';

import { FILTERS_FETCH_SUCCESS } from '../actions/filters';

import type { AnyAction } from 'redux';
import type { APIEntity, Filter as FilterEntity } from 'soapbox/types/entities';

type State = ImmutableList<FilterEntity>;

const importFilters = (_state: State, filters: APIEntity[]): State => {
  return ImmutableList(filters.map((filter) => normalizeFilter(filter)));
};

export default function filters(state: State = ImmutableList<FilterEntity>(), action: AnyAction): State {
  switch (action.type) {
    case FILTERS_FETCH_SUCCESS:
      return importFilters(state, action.filters);
    default:
      return state;
  }
}
