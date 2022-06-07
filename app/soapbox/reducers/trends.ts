import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import {
  TRENDS_FETCH_REQUEST,
  TRENDS_FETCH_SUCCESS,
  TRENDS_FETCH_FAIL,
} from '../actions/trends';

import type { AnyAction } from 'redux';
import type { APIEntity } from 'soapbox/types/entities';

const HistoryRecord = ImmutableRecord({
  accounts: '',
  day: '',
  uses: '',
});

const TrendingHashtagRecord = ImmutableRecord({
  name: '',
  url: '',
  history: ImmutableList<History>(),
});

const ReducerRecord = ImmutableRecord({
  items: ImmutableList<TrendingHashtag>(),
  isLoading: false,
});

type State = ReturnType<typeof ReducerRecord>;
type History = ReturnType<typeof HistoryRecord>;
export type TrendingHashtag = ReturnType<typeof TrendingHashtagRecord>;

export default function trendsReducer(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case TRENDS_FETCH_REQUEST:
      return state.set('isLoading', true);
    case TRENDS_FETCH_SUCCESS:
      return state.withMutations(map => {
        map.set('items', ImmutableList(action.tags.map((item: APIEntity) => TrendingHashtagRecord({ ...item, history: ImmutableList(item.history.map(HistoryRecord)) }))));
        map.set('isLoading', false);
      });
    case TRENDS_FETCH_FAIL:
      return state.set('isLoading', false);
    default:
      return state;
  }
}
