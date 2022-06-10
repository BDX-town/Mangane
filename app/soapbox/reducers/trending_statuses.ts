import { OrderedSet as ImmutableOrderedSet, Record as ImmutableRecord } from 'immutable';

import {
  TRENDING_STATUSES_FETCH_REQUEST,
  TRENDING_STATUSES_FETCH_SUCCESS,
} from 'soapbox/actions/trending_statuses';
import { APIEntity } from 'soapbox/types/entities';

import type { AnyAction } from 'redux';

const ReducerRecord = ImmutableRecord({
  items: ImmutableOrderedSet<string>(),
  isLoading: false,
});

type State = ReturnType<typeof ReducerRecord>;
type APIEntities = Array<APIEntity>;

const toIds = (items: APIEntities) => ImmutableOrderedSet(items.map(item => item.id));

const importStatuses = (state: State, statuses: APIEntities) => {
  return state.withMutations(state => {
    state.set('items', toIds(statuses));
    state.set('isLoading', false);
  });
};

export default function trending_statuses(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case TRENDING_STATUSES_FETCH_REQUEST:
      return state.set('isLoading', true);
    case TRENDING_STATUSES_FETCH_SUCCESS:
      return importStatuses(state, action.statuses);
    default:
      return state;
  }
}
