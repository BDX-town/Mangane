import {
  FETCH_TOKENS_SUCCESS,
  REVOKE_TOKEN_SUCCESS,
} from '../actions/auth';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  tokens: ImmutableList(),
});

export default function security(state = initialState, action) {
  switch(action.type) {
  case FETCH_TOKENS_SUCCESS:
    return state.set('tokens', fromJS(action.tokens));
  case REVOKE_TOKEN_SUCCESS:
    const idx = state.get('tokens').findIndex(t => t.get('id') === action.id);
    return state.deleteIn(['tokens', idx]);
  default:
    return state;
  }
}
