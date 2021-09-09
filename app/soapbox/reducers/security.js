import {
  FETCH_TOKENS_SUCCESS,
  REVOKE_TOKEN_SUCCESS,
} from '../actions/security';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  tokens: ImmutableList(),
});

const deleteToken = (state, tokenId) => {
  return state.update('tokens', tokens => {
    return tokens.filterNot(token => token.get('id') === tokenId);
  });
};

export default function security(state = initialState, action) {
  switch(action.type) {
  case FETCH_TOKENS_SUCCESS:
    return state.set('tokens', fromJS(action.tokens));
  case REVOKE_TOKEN_SUCCESS:
    return deleteToken(state, action.id);
  default:
    return state;
  }
}
