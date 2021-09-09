import {
  GROUP_FETCH_SUCCESS,
  GROUP_FETCH_FAIL,
  GROUPS_FETCH_SUCCESS,
} from '../actions/groups';
import { GROUP_UPDATE_SUCCESS } from '../actions/group_editor';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const normalizeGroup = (state, group) => state.set(group.id, fromJS(group));

const normalizeGroups = (state, groups) => {
  groups.forEach(group => {
    state = normalizeGroup(state, group);
  });

  return state;
};

export default function groups(state = initialState, action) {
  switch(action.type) {
  case GROUP_FETCH_SUCCESS:
  case GROUP_UPDATE_SUCCESS:
    return normalizeGroup(state, action.group);
  case GROUPS_FETCH_SUCCESS:
    return normalizeGroups(state, action.groups);
  case GROUP_FETCH_FAIL:
    return state.set(action.id, false);
  default:
    return state;
  }
}
