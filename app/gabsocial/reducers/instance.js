import { INSTANCE_IMPORT } from '../actions/instance';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function instance(state = initialState, action) {
  switch(action.type) {
  case INSTANCE_IMPORT:
    return ImmutableMap(fromJS(action.instance));
  default:
    return state;
  }
};
