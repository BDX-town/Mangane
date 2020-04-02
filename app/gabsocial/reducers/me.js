import { ME_FETCH_SUCCESS } from '../actions/me';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function me(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
    return fromJS(action.me.id);
  default:
    return state;
  }
};
