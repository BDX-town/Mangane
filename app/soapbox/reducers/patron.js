import { PATRON_INSTANCE_FETCH_SUCCESS } from '../actions/patron';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function patron(state = initialState, action) {
  switch(action.type) {
  case PATRON_INSTANCE_FETCH_SUCCESS:
    return fromJS(action.instance);
  default:
    return state;
  }
};
