import { Map as ImmutableMap } from 'immutable';
import {
  GROUP_CREATE_REQUEST,
  GROUP_CREATE_FAIL,
  GROUP_CREATE_SUCCESS,
  GROUP_UPDATE_REQUEST,
  GROUP_UPDATE_FAIL,
  GROUP_UPDATE_SUCCESS,
  GROUP_EDITOR_RESET,
  GROUP_EDITOR_SETUP,
  GROUP_EDITOR_VALUE_CHANGE,
} from '../actions/group_editor';

const initialState = ImmutableMap({
  groupId: null,
  isSubmitting: false,
  isChanged: false,
  title: '',
  description: '',
  coverImage: null,
});

export default function groupEditorReducer(state = initialState, action) {
  switch(action.type) {
  case GROUP_EDITOR_RESET:
    return initialState;
  case GROUP_EDITOR_SETUP:
    return state.withMutations(map => {
      map.set('groupId', action.group.get('id'));
      map.set('title', action.group.get('title'));
      map.set('description', action.group.get('description'));
      map.set('isSubmitting', false);
    });
  case GROUP_EDITOR_VALUE_CHANGE:
    return state.withMutations(map => {
      map.set(action.field, action.value);
      map.set('isChanged', true);
    });
  case GROUP_CREATE_REQUEST:
  case GROUP_UPDATE_REQUEST:
    return state.withMutations(map => {
      map.set('isSubmitting', true);
      map.set('isChanged', false);
    });
  case GROUP_CREATE_FAIL:
  case GROUP_UPDATE_FAIL:
    return state.set('isSubmitting', false);
  case GROUP_CREATE_SUCCESS:
  case GROUP_UPDATE_SUCCESS:
    return state.withMutations(map => {
      map.set('isSubmitting', false);
      map.set('groupId', action.group.id);
    });
  default:
    return state;
  }
}
