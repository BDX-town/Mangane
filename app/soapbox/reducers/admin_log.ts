import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
  OrderedSet as ImmutableOrderedSet,
} from 'immutable';

import { ADMIN_LOG_FETCH_SUCCESS } from 'soapbox/actions/admin';

import type { AnyAction } from 'redux';

const LogEntryRecord = ImmutableRecord({
  data: ImmutableMap<string, any>(),
  id: 0,
  message: '',
  time: 0,
});

const ReducerRecord = ImmutableRecord({
  items: ImmutableMap<string, LogEntry>(),
  index: ImmutableOrderedSet<number>(),
  total: 0,
});

type LogEntry = ReturnType<typeof LogEntryRecord>;
type State = ReturnType<typeof ReducerRecord>;
type APIEntity = Record<string, any>;
type APIEntities = Array<APIEntity>;

const parseItems = (items: APIEntities) => {
  const ids: Array<number> = [];
  const map: Record<string, LogEntry> = {};

  items.forEach(item => {
    ids.push(item.id);
    map[item.id] = LogEntryRecord(item);
  });

  return { ids: ids, map: map };
};

const importItems = (state: State, items: APIEntities, total: number) => {
  const { ids, map } = parseItems(items);

  return state.withMutations(state => {
    state.update('index', v => v.union(ids));
    state.update('items', v => v.merge(map));
    state.set('total', total);
  });
};

export default function admin_log(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case ADMIN_LOG_FETCH_SUCCESS:
      return importItems(state, action.items, action.total);
    default:
      return state;
  }
}
