import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { GROUPS_FETCH_SUCCESS } from '../actions/groups';

const initialState = ImmutableMap({
  featured: ImmutableList(),
  member: ImmutableList(),
  admin: ImmutableList(),
});

const normalizeList = (state, type, id, groups) => {
  return state.set(type, ImmutableList(groups.map(item => item.id)));
};

export default function groupLists(state = initialState, action) {
  switch(action.type) {
  case GROUPS_FETCH_SUCCESS:
    return normalizeList(state, action.tab, action.id, action.groups);
  default:
    return state;
  }
}
