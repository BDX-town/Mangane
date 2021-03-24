import {
  AUTH_APP_CREATED,
  AUTH_LOGGED_IN,
  AUTH_APP_AUTHORIZED,
  AUTH_LOGGED_OUT,
  SWITCH_ACCOUNT,
} from '../actions/auth';
import { Map as ImmutableMap, fromJS } from 'immutable';

const defaultState = ImmutableMap({
  app: ImmutableMap(),
  user: ImmutableMap(),
  users: ImmutableMap(),
  me: null,
});

const localState = fromJS(JSON.parse(localStorage.getItem('soapbox:auth')));
const initialState = defaultState.merge(localState);

const reducer = (state, action) => {
  switch(action.type) {
  case AUTH_APP_CREATED:
    return state.set('app', fromJS(action.app));
  case AUTH_APP_AUTHORIZED:
    return state.update('app', ImmutableMap(), app => app.merge(fromJS(action.app)));
  case AUTH_LOGGED_IN:
    return state.set('user', fromJS(action.token));
  case AUTH_LOGGED_OUT:
    return state.set('user', ImmutableMap());
  case SWITCH_ACCOUNT:
    return state.set('me', action.accountId);
  default:
    return state;
  }
};

export default function auth(state = initialState, action) {
  state = reducer(state, action);
  localStorage.setItem('soapbox:auth', JSON.stringify(state.toJS()));

  if (action.type === SWITCH_ACCOUNT) {
    location.reload();
  }

  return state;
};
