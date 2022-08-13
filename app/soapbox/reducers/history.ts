import { List as ImmutableList, Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';

import { HISTORY_FETCH_REQUEST, HISTORY_FETCH_SUCCESS, HISTORY_FETCH_FAIL } from 'soapbox/actions/history';
import { normalizeStatusEdit } from 'soapbox/normalizers';

import type { AnyAction } from 'redux';

type StatusEditRecord = ReturnType<typeof normalizeStatusEdit>;

const HistoryRecord = ImmutableRecord({
  loading: false,
  items: ImmutableList<StatusEditRecord>(),
});

type State = ImmutableMap<string, ReturnType<typeof HistoryRecord>>;

const initialState: State = ImmutableMap();

export default function history(state: State = initialState, action: AnyAction) {
  switch (action.type) {
    case HISTORY_FETCH_REQUEST:
      return state.update(action.statusId, HistoryRecord(), history => history!.withMutations(map => {
        map.set('loading', true);
        map.set('items', ImmutableList());
      }));
    case HISTORY_FETCH_SUCCESS:
      return state.update(action.statusId, HistoryRecord(), history => history!.withMutations(map => {
        map.set('loading', false);
        map.set('items', ImmutableList(action.history.map((x: any, i: number) => ({ ...x, account: x.account.id, original: i === 0 })).reverse().map(normalizeStatusEdit)));
      }));
    case HISTORY_FETCH_FAIL:
      return state.update(action.statusId, HistoryRecord(), history => history!.set('loading', false));
    default:
      return state;
  }
}