import {
  AUTH_APP_CREATED,
  AUTH_LOGGED_IN,
  AUTH_APP_AUTHORIZED,
} from '../actions/auth';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap({
  app: ImmutableMap(JSON.parse(localStorage.getItem('soapbox:auth:app'))),
  user: ImmutableMap(JSON.parse(localStorage.getItem('soapbox:auth:user'))),
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
  default:
    return state;
  }
};
