import { PATRON_FUNDING_IMPORT } from '../actions/patron';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function patron(state = initialState, action) {
  switch(action.type) {
  case PATRON_FUNDING_IMPORT:
    return state.set('funding', fromJS(action.funding));
  default:
    return state;
  }
};
