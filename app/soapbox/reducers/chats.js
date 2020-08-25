import { CHATS_FETCH_SUCCESS } from '../actions/chats';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function admin(state = initialState, action) {
  switch(action.type) {
  case CHATS_FETCH_SUCCESS:
    return state.merge(fromJS(action.data).reduce((acc, curr) => (
      acc.set(curr.get('id'), curr)
    ), ImmutableMap()));
  default:
    return state;
  }
};
