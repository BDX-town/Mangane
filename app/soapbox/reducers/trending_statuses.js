import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

import {
  TRENDING_STATUSES_FETCH_REQUEST,
  TRENDING_STATUSES_FETCH_SUCCESS,
} from 'soapbox/actions/trending_statuses';

const initialState = ImmutableMap({
  items: ImmutableOrderedSet(),
  isLoading: false,
});

const toIds = items => ImmutableOrderedSet(items.map(item => item.id));

const importStatuses = (state, statuses) => {
  return state.withMutations(state => {
    state.set('items', toIds(statuses));
    state.set('isLoading', false);
  });
};

export default function trending_statuses(state = initialState, action) {
  switch (action.type) {
    case TRENDING_STATUSES_FETCH_REQUEST:
      return state.set('isLoading', true);
    case TRENDING_STATUSES_FETCH_SUCCESS:
      return importStatuses(state, action.statuses);
    default:
      return state;
  }
}
