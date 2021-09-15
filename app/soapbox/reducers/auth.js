import {
  AUTH_APP_CREATED,
  AUTH_LOGGED_IN,
  AUTH_APP_AUTHORIZED,
  AUTH_LOGGED_OUT,
  SWITCH_ACCOUNT,
  VERIFY_CREDENTIALS_SUCCESS,
  VERIFY_CREDENTIALS_FAIL,
} from '../actions/auth';
import { ME_FETCH_SKIP } from '../actions/me';
import { MASTODON_PRELOAD_IMPORT } from 'soapbox/actions/preload';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import { validId, isURL } from 'soapbox/utils/auth';
import { trim } from 'lodash';
import { FE_SUBDIRECTORY } from 'soapbox/build_config';

const defaultState = ImmutableMap({
  app: ImmutableMap(),
  users: ImmutableMap(),
  tokens: ImmutableMap(),
  me: null,
});

const buildKey = parts => parts.join(':');

// For subdirectory support
const NAMESPACE = trim(FE_SUBDIRECTORY, '/') ? `soapbox@${FE_SUBDIRECTORY}` : 'soapbox';

const STORAGE_KEY = buildKey([NAMESPACE, 'auth']);
const SESSION_KEY = buildKey([NAMESPACE, 'auth', 'me']);

const getSessionUser = () => {
  const id = sessionStorage.getItem(SESSION_KEY);
  return validId(id) ? id : undefined;
};

const sessionUser = getSessionUser();
const localState = fromJS(JSON.parse(localStorage.getItem(STORAGE_KEY)));

// Checks if the user has an ID and access token
const validUser = user => {
  try {
    return validId(user.get('id')) && validId(user.get('access_token'));
  } catch(e) {
    return false;
  }
};

// Finds the first valid user in the state
const firstValidUser = state => state.get('users', ImmutableMap()).find(validUser);

// For legacy purposes. IDs get upgraded to URLs further down.
const getUrlOrId = user => {
  try {
    const { id, url } = user.toJS();
    return url || id;
  } catch {
    return null;
  }
};

// If `me` doesn't match an existing user, attempt to shift it.
const maybeShiftMe = state => {
  const me = state.get('me');
  const user = state.getIn(['users', me]);

  if (!validUser(user)) {
    const nextUser = firstValidUser(state);
    return state.set('me', getUrlOrId(nextUser));
  } else {
    return state;
  }
};

// Set the user from the session or localStorage, whichever is valid first
const setSessionUser = state => state.update('me', null, me => {
  const user = ImmutableList([
    state.getIn(['users', sessionUser]),
    state.getIn(['users', me]),
  ]).find(validUser);

  return getUrlOrId(user);
});

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

const isUpgradingUrlId = state => {
  const me = state.get('me');
  const user = state.getIn(['users', me]);
  return validId(me) && user && !isURL(me);
};

// Checks the state and makes it valid
const sanitizeState = state => {
  // Skip sanitation during ID to URL upgrade
  if (isUpgradingUrlId(state)) return state;

  return state.withMutations(state => {
    // Remove invalid users, ensure ID match
    state.update('users', ImmutableMap(), users => (
      users.filter((user, url) => (
        validUser(user) && user.get('url') === url
      ))
    ));
    // Remove mismatched tokens
    state.update('tokens', ImmutableMap(), tokens => (
      tokens.filter((token, id) => (
        validId(id) && token.get('access_token') === id
      ))
    ));
  });
};

const persistAuth = state => localStorage.setItem(STORAGE_KEY, JSON.stringify(state.toJS()));

const persistSession = state => {
  const me = state.get('me');
  if (me && typeof me === 'string') {
    sessionStorage.setItem(SESSION_KEY, me);
  }
};

const persistState = state => {
  persistAuth(state);
  persistSession(state);
};

const initialize = state => {
  return state.withMutations(state => {
    maybeShiftMe(state);
    setSessionUser(state);
    migrateLegacy(state);
    sanitizeState(state);
    persistState(state);
  });
};

const initialState = initialize(defaultState.merge(localState));

const importToken = (state, token) => {
  return state.setIn(['tokens', token.access_token], fromJS(token));
};

// Upgrade the `_legacy` placeholder ID with a real account
const upgradeLegacyId = (state, account) => {
  if (localState) return state;
  return state.withMutations(state => {
    state.update('me', null, me => me === '_legacy' ? account.url : me);
    state.deleteIn(['users', '_legacy']);
  });
  // TODO: Delete `soapbox:auth:app` and `soapbox:auth:user` localStorage?
  // By this point it's probably safe, but we'll leave it just in case.
};

// Users are now stored by their ActivityPub ID instead of their
// primary key to support auth against multiple hosts.
const upgradeNonUrlId = (state, account) => {
  const me = state.get('me');
  if (isURL(me)) return state;

  return state.withMutations(state => {
    state.update('me', null, me => me === account.id ? account.url : me);
    state.deleteIn(['users', account.id]);
  });
};

// Returns a predicate function for filtering a mismatched user/token
const userMismatch = (token, account) => {
  return (user, url) => {
    const sameToken = user.get('access_token') === token;
    const differentUrl = url !== account.url || user.get('url') !== account.url;
    const differentId = user.get('id') !== account.id;

    return sameToken && (differentUrl || differentId);
  };
};

const importCredentials = (state, token, account) => {
  return state.withMutations(state => {
    state.setIn(['users', account.url], ImmutableMap({
      id: account.id,
      access_token: token,
      url: account.url,
    }));
    state.setIn(['tokens', token, 'account'], account.id);
    state.setIn(['tokens', token, 'me'], account.url);
    state.update('users', ImmutableMap(), users => users.filterNot(userMismatch(token, account)));
    state.update('me', null, me => me || account.url);
    upgradeLegacyId(state, account);
    upgradeNonUrlId(state, account);
  });
};

const deleteToken = (state, token) => {
  return state.withMutations(state => {
    state.update('tokens', ImmutableMap(), tokens => tokens.delete(token));
    state.update('users', ImmutableMap(), users => users.filterNot(user => user.get('access_token') === token));
    maybeShiftMe(state);
  });
};

const deleteUser = (state, account) => {
  const accountUrl = account.get('url');

  return state.withMutations(state => {
    state.update('users', ImmutableMap(), users => users.delete(accountUrl));
    state.update('tokens', ImmutableMap(), tokens => tokens.filterNot(token => token.get('me') === accountUrl));
    maybeShiftMe(state);
  });
};

const importMastodonPreload = (state, data) => {
  return state.withMutations(state => {
    const accountId   = data.getIn(['meta', 'me']);
    const accountUrl  = data.getIn(['accounts', accountId, 'url']);
    const accessToken = data.getIn(['meta', 'access_token']);

    if (validId(accessToken) && validId(accountId) && isURL(accountUrl)) {
      state.setIn(['tokens', accessToken], fromJS({
        access_token: accessToken,
        account: accountId,
        me: accountUrl,
        scope: 'read write follow push',
        token_type: 'Bearer',
      }));

      state.setIn(['users', accountUrl], fromJS({
        id: accountId,
        access_token: accessToken,
        url: accountUrl,
      }));
    }

    maybeShiftMe(state);
  });
};

const reducer = (state, action) => {
  switch(action.type) {
  case AUTH_APP_CREATED:
    return state.set('app', fromJS(action.app));
  case AUTH_APP_AUTHORIZED:
    return state.update('app', ImmutableMap(), app => app.merge(fromJS(action.token)));
  case AUTH_LOGGED_IN:
    return importToken(state, action.token);
  case AUTH_LOGGED_OUT:
    return deleteUser(state, action.account);
  case VERIFY_CREDENTIALS_SUCCESS:
    return importCredentials(state, action.token, action.account);
  case VERIFY_CREDENTIALS_FAIL:
    return action.error.response.status === 403 ? deleteToken(state, action.token) : state;
  case SWITCH_ACCOUNT:
    return state.set('me', action.account.get('url'));
  case ME_FETCH_SKIP:
    return state.set('me', null);
  case MASTODON_PRELOAD_IMPORT:
    return importMastodonPreload(state, fromJS(action.data));
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
  const me = state.get('me');
  const oldMe = oldState.get('me');

  const stillValid = validMe(oldState) && validMe(state);
  const didChange = oldMe !== me;
  const userUpgradedUrl = state.getIn(['users', me, 'id']) === oldMe;

  return stillValid && didChange && !userUpgradedUrl;
};

const maybeReload = (oldState, state, action) => {
  const loggedOutStandalone = action.type === AUTH_LOGGED_OUT && action.standalone;
  const switched = userSwitched(oldState, state);

  if (switched || loggedOutStandalone) {
    reload(state);
  }
};

export default function auth(oldState = initialState, action) {
  const state = reducer(oldState, action);

  if (!state.equals(oldState)) {
    // Persist the state in localStorage
    persistAuth(state);

    // When middle-clicking a profile, we want to save the
    // user in localStorage, but not update the reducer
    if (action.background === true) {
      return oldState;
    }

    // Persist the session
    persistSession(state);

    // Reload the page under some conditions
    maybeReload(oldState, state, action);
  }

  return state;
}
