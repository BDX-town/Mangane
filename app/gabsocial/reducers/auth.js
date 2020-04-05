import { AUTH_APP_CREATED, AUTH_LOGGED_IN } from '../actions/auth';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap({
  app: JSON.parse(localStorage.getItem('app')),
  user: JSON.parse(localStorage.getItem('user')),
});

export default function auth(state = initialState, action) {
  switch(action.type) {
  case AUTH_APP_CREATED:
    localStorage.setItem('app', JSON.stringify(action.app)); // TODO: Better persistence
    return state.set('app', ImmutableMap(action.app));
  case AUTH_LOGGED_IN:
    localStorage.setItem('user', JSON.stringify(action.user)); // TODO: Better persistence
    return state.set('user', ImmutableMap(action.user));
  default:
    return state;
  }
};
