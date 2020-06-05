import {
  AUTH_APP_CREATED,
  AUTH_LOGGED_IN,
  AUTH_APP_AUTHORIZED,
  AUTH_LOGGED_OUT,
  FETCH_TOKENS_SUCCESS,
  REVOKE_TOKEN_SUCCESS,
} from '../actions/auth';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  app: ImmutableMap(JSON.parse(localStorage.getItem('soapbox:auth:app'))),
  user: ImmutableMap(JSON.parse(localStorage.getItem('soapbox:auth:user'))),
  tokens: ImmutableList(),
});

export default function auth(state = initialState, action) {
  switch(action.type) {
  case AUTH_APP_CREATED:
    localStorage.setItem('soapbox:auth:app', JSON.stringify(action.app)); // TODO: Better persistence
    return state.set('app', ImmutableMap(action.app));
  case AUTH_APP_AUTHORIZED:
    const merged = state.get('app').merge(ImmutableMap(action.app));
    localStorage.setItem('soapbox:auth:app', JSON.stringify(merged)); // TODO: Better persistence
    return state.set('app', merged);
  case AUTH_LOGGED_IN:
    localStorage.setItem('soapbox:auth:user', JSON.stringify(action.user)); // TODO: Better persistence
    return state.set('user', ImmutableMap(action.user));
  case AUTH_LOGGED_OUT:
    localStorage.removeItem('soapbox:auth:user');
    return state.set('user', ImmutableMap());
  case FETCH_TOKENS_SUCCESS:
    return state.set('tokens', fromJS(action.tokens));
  case REVOKE_TOKEN_SUCCESS:
    const idx = state.get('tokens').findIndex(t => t.get('id') === action.id);
    return state.deleteIn(['tokens', idx]);
  default:
    return state;
  }
};
