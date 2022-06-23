import { Map as ImmutableMap, List as ImmutableList, Record as ImmutableRecord, fromJS } from 'immutable';

import {
  MFA_FETCH_SUCCESS,
  MFA_CONFIRM_SUCCESS,
  MFA_DISABLE_SUCCESS,
} from '../actions/mfa';
import {
  FETCH_TOKENS_SUCCESS,
  REVOKE_TOKEN_SUCCESS,
} from '../actions/security';

import type { AnyAction } from 'redux';

const TokenRecord = ImmutableRecord({
  id: 0,
  app_name: '',
  valid_until: '',
});

const ReducerRecord = ImmutableRecord({
  tokens: ImmutableList<Token>(),
  mfa: ImmutableMap({
    settings: ImmutableMap({
      totp: false,
    }),
  }),
});

type State = ReturnType<typeof ReducerRecord>;

export type Token = ReturnType<typeof TokenRecord>;

const deleteToken = (state: State, tokenId: number) => {
  return state.update('tokens', tokens => {
    return tokens.filterNot(token => token.id === tokenId);
  });
};

const importMfa = (state: State, data: any) => {
  return state.set('mfa', data);
};

const enableMfa = (state: State, method: string) => {
  return state.setIn(['mfa', 'settings', method], true);
};

const disableMfa = (state: State, method: string) => {
  return state.setIn(['mfa', 'settings', method], false);
};

export default function security(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case FETCH_TOKENS_SUCCESS:
      return state.set('tokens', ImmutableList(action.tokens.map(TokenRecord)));
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
