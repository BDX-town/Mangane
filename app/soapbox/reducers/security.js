import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  MFA_FETCH_SUCCESS,
  MFA_CONFIRM_SUCCESS,
  MFA_DISABLE_SUCCESS,
} from '../actions/mfa';
import {
  FETCH_TOKENS_SUCCESS,
  REVOKE_TOKEN_SUCCESS,
} from '../actions/security';

const initialState = ImmutableMap({
  tokens: ImmutableList(),
  mfa: ImmutableMap({
    settings: ImmutableMap({
      totp: false,
    }),
  }),
});

const deleteToken = (state, tokenId) => {
  return state.update('tokens', tokens => {
    return tokens.filterNot(token => token.get('id') === tokenId);
  });
};

const importMfa = (state, data) => {
  return state.set('mfa', data);
};

const enableMfa = (state, method) => {
  return state.setIn(['mfa', 'settings', method], true);
};

const disableMfa = (state, method) => {
  return state.setIn(['mfa', 'settings', method], false);
};

export default function security(state = initialState, action) {
  switch(action.type) {
  case FETCH_TOKENS_SUCCESS:
    return state.set('tokens', fromJS(action.tokens));
  case REVOKE_TOKEN_SUCCESS:
    return deleteToken(state, action.id);
  case MFA_FETCH_SUCCESS:
    return importMfa(state, fromJS(action.data));
  case MFA_CONFIRM_SUCCESS:
    return enableMfa(state, action.method);
  case MFA_DISABLE_SUCCESS:
    return disableMfa(state, action.method);
  default:
    return state;
  }
}
