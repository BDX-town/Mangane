import { ADMIN_LOG_FETCH_SUCCESS } from 'soapbox/actions/admin';
import {
  Map as ImmutableMap,
  OrderedSet as ImmutableOrderedSet,
  fromJS,
} from 'immutable';

const initialState = ImmutableMap({
  items: ImmutableMap(),
  index: ImmutableOrderedSet(),
  total: 0,
});

const parseItems = items => {
  const ids = [];
  const map = {};

  items.forEach(item => {
    ids.push(item.id);
    map[item.id] = item;
  });

  return { ids: ids, map: map };
};

const importItems = (state, items, total) => {
  const { ids, map } = parseItems(items);

  return state.withMutations(state => {
    state.update('index', v => v.union(ids));
    state.update('items', v => v.merge(fromJS(map)));
    state.set('total', total);
  });
};

export default function admin_log(state = initialState, action) {
  switch(action.type) {
  case ADMIN_LOG_FETCH_SUCCESS:
    return importItems(state, action.items, action.total);
  default:
    return state;
  }
}
