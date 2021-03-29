import { INIT_STORE } from '../actions/store';
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
    upgradeLegacyId(state, account);
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

const deleteToken = (state, token) => {
  return state.withMutations(state => {
    state.update('tokens', ImmutableMap(), tokens => tokens.delete(token));
    state.update('users', ImmutableMap(), users => users.filterNot(user => user.get('access_token') === token));
    maybeShiftMe(state);
  });
};

const deleteUser = (state, accountId) => {
  return state.withMutations(state => {
    state.update('users', ImmutableMap(), users => users.delete(accountId));
    state.update('tokens', ImmutableMap(), tokens => tokens.filterNot(token => token.get('account') === accountId));
    maybeShiftMe(state);
  });
};

// Upgrade the initial state
const migrateLegacy = state => {
  if (localState) return state;
  return state.withMutations(state => {
    const app = fromJS(JSON.parse(localStorage.getItem('soapbox:auth:app')));
    const user = fromJS(JSON.parse(localStorage.getItem('soapbox:auth:user')));
    if (!user) return;
    state.set('me', '_legacy'); // Placeholder account ID
    state.set('app', app);
    state.set('tokens', ImmutableMap({
      [user.get('access_token')]: user.set('account', '_legacy'),
    }));
    state.set('users', ImmutableMap({
      '_legacy': ImmutableMap({
        id: '_legacy',
        access_token: user.get('access_token'),
      }),
    }));
  });
};

// Upgrade the `_legacy` placeholder ID with a real account
const upgradeLegacyId = (state, account) => {
  if (localState) return state;
  return state.withMutations(state => {
    state.update('me', null, me => me === '_legacy' ? account.id : me);
    state.deleteIn(['users', '_legacy']);
  });
  // TODO: Delete `soapbox:auth:app` and `soapbox:auth:user` localStorage?
  // By this point it's probably safe, but we'll leave it just in case.
};

const setSessionUser = state => {
  const sessionUser = sessionStorage.getItem('soapbox:auth:me');
  if (sessionUser) {
    return state.set('me', sessionUser);
  } else {
    sessionStorage.setItem('soapbox:auth:me', state.get('me'));
    return state;
  }
};

const initialize = state => {
  return state.withMutations(state => {
    setSessionUser(state);
    maybeShiftMe(state);
    migrateLegacy(state);
  });
};

const reducer = (state, action) => {
  switch(action.type) {
  case INIT_STORE:
    return initialize(state);
  case AUTH_APP_CREATED:
    return state.set('app', fromJS(action.app));
  case AUTH_APP_AUTHORIZED:
    return state.update('app', ImmutableMap(), app => app.merge(fromJS(action.app)));
  case AUTH_LOGGED_IN:
    return importToken(state, action.token);
  case AUTH_LOGGED_OUT:
    return deleteUser(state, action.accountId);
  case VERIFY_CREDENTIALS_SUCCESS:
    return importCredentials(state, action.token, action.account);
  case VERIFY_CREDENTIALS_FAIL:
    return deleteToken(state, action.token);
  case SWITCH_ACCOUNT:
    return state.set('me', action.accountId);
  default:
    return state;
  }
};

const reload = () => location.replace('/');

// `me` is a user ID string
const validMe = state => {
  const me = state.get('me');
  return typeof me === 'string' && me !== '_legacy';
};

// `me` has changed from one valid ID to another
const userSwitched = (oldState, state) => {
  const stillValid = validMe(oldState) && validMe(state);
  const didChange = oldState.get('me') !== state.get('me');

  return stillValid && didChange;
};

const maybeReload = (oldState, state, action) => {
  if (userSwitched(oldState, state)) {
    reload(state);
  }
};

export default function auth(oldState = initialState, action) {
  const state = reducer(oldState, action);

  // Persist the state in localStorage
  if (!state.equals(oldState)) {
    localStorage.setItem('soapbox:auth', JSON.stringify(state.toJS()));
    sessionStorage.setItem('soapbox:auth:me', state.get('me'));

    // Reload the page under some conditions
    maybeReload(oldState, state, action);
  }

  return state;
};
