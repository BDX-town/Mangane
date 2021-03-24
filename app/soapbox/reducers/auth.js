import {
  AUTH_APP_CREATED,
  AUTH_LOGGED_IN,
  AUTH_APP_AUTHORIZED,
  AUTH_LOGGED_OUT,
  SWITCH_ACCOUNT,
  VERIFY_CREDENTIALS_SUCCESS,
  VERIFY_CREDENTIALS_FAIL,
} from '../actions/auth';
import { Map as ImmutableMap, fromJS } from 'immutable';

const defaultState = ImmutableMap({
  app: ImmutableMap(),
  users: ImmutableMap(),
  tokens: ImmutableMap(),
  me: null,
});

const localState = fromJS(JSON.parse(localStorage.getItem('soapbox:auth')));
const initialState = defaultState.merge(localState);

const importToken = (state, token) => {
  return state.setIn(['tokens', token.access_token], fromJS(token));
};

const importCredentials = (state, token, account) => {
  return state.withMutations(state => {
    state.setIn(['users', account.id], ImmutableMap({
      id: account.id,
      access_token: token,
    }));
    state.setIn(['tokens', token, 'account'], account.id);
    state.update('me', null, me => me || account.id);
  });
};

// If `me` doesn't match an existing user, attempt to shift it.
const maybeShiftMe = state => {
  const users = state.get('users', ImmutableMap());
  const me = state.get('me');

  if (!users.get(me)) {
    return state.set('me', users.first(ImmutableMap()).get('id'));
  } else {
    return state;
  }
};

const importFailedToken = (state, token) => {
  return state.withMutations(state => {
    state.update('tokens', ImmutableMap(), tokens => tokens.delete(token));
    state.update('users', ImmutableMap(), users => users.filterNot(user => user.get('access_token') === token));
    maybeShiftMe(state);
  });
};

const reducer = (state, action) => {
  switch(action.type) {
  case AUTH_APP_CREATED:
    return state.set('app', fromJS(action.app));
  case AUTH_APP_AUTHORIZED:
    return state.update('app', ImmutableMap(), app => app.merge(fromJS(action.app)));
  case AUTH_LOGGED_IN:
    return importToken(state, action.token);
  case AUTH_LOGGED_OUT:
    return state.set('user', ImmutableMap());
  case VERIFY_CREDENTIALS_SUCCESS:
    return importCredentials(state, action.token, action.account);
  case VERIFY_CREDENTIALS_FAIL:
    return importFailedToken(state, action.token);
  case SWITCH_ACCOUNT:
    return state.set('me', action.accountId);
  default:
    return state;
  }
};

export default function auth(oldState = initialState, action) {
  const state = reducer(oldState, action);
  localStorage.setItem('soapbox:auth', JSON.stringify(state.toJS()));

  // Reload the page when the current user changes.
  if (state.get('me') !== oldState.get('me')) {
    location.reload();
  }

  return state;
};
