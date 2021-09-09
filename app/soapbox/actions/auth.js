/**
 * Auth: login & registration workflow.
 * This file contains abstractions over auth concepts.
 * @module soapbox/actions/auth
 * @see module:soapbox/actions/apps
 * @see module:soapbox/actions/oauth
 * @see module:soapbox/actions/security
 */

import { defineMessages } from 'react-intl';
import api, { baseClient } from '../api';
import { importFetchedAccount } from './importer';
import snackbar from 'soapbox/actions/snackbar';
import { createAccount } from 'soapbox/actions/accounts';
import { fetchMeSuccess, fetchMeFail } from 'soapbox/actions/me';
import { getLoggedInAccount, parseBaseURL } from 'soapbox/utils/auth';
import { createApp } from 'soapbox/actions/apps';
import { obtainOAuthToken, revokeOAuthToken } from 'soapbox/actions/oauth';
import sourceCode from 'soapbox/utils/code';
import { getFeatures } from 'soapbox/utils/features';
import { isStandalone } from 'soapbox/utils/state';

export const SWITCH_ACCOUNT = 'SWITCH_ACCOUNT';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';

export const VERIFY_CREDENTIALS_REQUEST = 'VERIFY_CREDENTIALS_REQUEST';
export const VERIFY_CREDENTIALS_SUCCESS = 'VERIFY_CREDENTIALS_SUCCESS';
export const VERIFY_CREDENTIALS_FAIL    = 'VERIFY_CREDENTIALS_FAIL';

export const messages = defineMessages({
  loggedOut: { id: 'auth.logged_out', defaultMessage: 'Logged out.' },
  invalidCredentials: { id: 'auth.invalid_credentials', defaultMessage: 'Wrong username or password' },
});

const noOp = () => () => new Promise(f => f());

const getScopes = state => {
  const instance = state.get('instance');
  const { scopes } = getFeatures(instance);
  return scopes;
};

function createAppAndToken() {
  return (dispatch, getState) => {
    return dispatch(createAuthApp()).then(() => {
      return dispatch(createAppToken());
    });
  };
}

function createAuthApp() {
  return (dispatch, getState) => {
    const params = {
      client_name:   sourceCode.displayName,
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes:        getScopes(getState()),
      website:       sourceCode.homepage,
    };

    return dispatch(createApp(params)).then(app => {
      return dispatch({ type: AUTH_APP_CREATED, app });
    });
  };
}

function createAppToken() {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);

    const params = {
      client_id:     app.get('client_id'),
      client_secret: app.get('client_secret'),
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'client_credentials',
      scope:         getScopes(getState()),
    };

    return dispatch(obtainOAuthToken(params)).then(token => {
      return dispatch({ type: AUTH_APP_AUTHORIZED, app, token });
    });
  };
}

function createUserToken(username, password) {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);

    const params = {
      client_id:     app.get('client_id'),
      client_secret: app.get('client_secret'),
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'password',
      username:      username,
      password:      password,
      scope:         getScopes(getState()),
    };

    return dispatch(obtainOAuthToken(params))
      .then(token => dispatch(authLoggedIn(token)));
  };
}

export function refreshUserToken() {
  return (dispatch, getState) => {
    const refreshToken = getState().getIn(['auth', 'user', 'refresh_token']);
    const app = getState().getIn(['auth', 'app']);

    if (!refreshToken) return dispatch(noOp());

    const params = {
      client_id:     app.get('client_id'),
      client_secret: app.get('client_secret'),
      refresh_token: refreshToken,
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'refresh_token',
      scope:         getScopes(getState()),
    };

    return dispatch(obtainOAuthToken(params))
      .then(token => dispatch(authLoggedIn(token)));
  };
}

export function otpVerify(code, mfa_token) {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);
    return api(getState, 'app').post('/oauth/mfa/challenge', {
      client_id: app.get('client_id'),
      client_secret: app.get('client_secret'),
      mfa_token: mfa_token,
      code: code,
      challenge_type: 'totp',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    }).then(({ data: token }) => dispatch(authLoggedIn(token)));
  };
}

export function verifyCredentials(token, accountUrl) {
  const baseURL = parseBaseURL(accountUrl);

  return (dispatch, getState) => {
    dispatch({ type: VERIFY_CREDENTIALS_REQUEST });

    return baseClient(token, baseURL).get('/api/v1/accounts/verify_credentials').then(({ data: account }) => {
      dispatch(importFetchedAccount(account));
      dispatch({ type: VERIFY_CREDENTIALS_SUCCESS, token, account });
      if (account.id === getState().get('me')) dispatch(fetchMeSuccess(account));
      return account;
    }).catch(error => {
      if (getState().get('me') === null) dispatch(fetchMeFail(error));
      dispatch({ type: VERIFY_CREDENTIALS_FAIL, token, error });
    });
  };
}

export function logIn(intl, username, password) {
  return (dispatch, getState) => {
    return dispatch(createAppAndToken()).then(() => {
      return dispatch(createUserToken(username, password));
    }).catch(error => {
      if (error.response.data.error === 'mfa_required') {
        // If MFA is required, throw the error and handle it in the component.
        throw error;
      } else if (error.response.data.error === 'invalid_grant') {
        // Mastodon returns this user-unfriendly error as a catch-all
        // for everything from "bad request" to "wrong password".
        // Assume our code is correct and it's a wrong password.
        dispatch(snackbar.error(intl.formatMessage(messages.invalidCredentials)));
      } else if (error.response.data.error) {
        // If the backend returns an error, display it.
        dispatch(snackbar.error(error.response.data.error));
      } else {
        // Return "wrong password" message.
        dispatch(snackbar.error(intl.formatMessage(messages.invalidCredentials)));
      }
      throw error;
    });
  };
}

export function logOut(intl) {
  return (dispatch, getState) => {
    const state = getState();
    const account = getLoggedInAccount(state);
    const standalone = isStandalone(state);

    const params = {
      client_id: state.getIn(['auth', 'app', 'client_id']),
      client_secret: state.getIn(['auth', 'app', 'client_secret']),
      token: state.getIn(['auth', 'users', account.get('url'), 'access_token']),
    };

    return dispatch(revokeOAuthToken(params)).finally(() => {
      dispatch({ type: AUTH_LOGGED_OUT, account, standalone });
      dispatch(snackbar.success(intl.formatMessage(messages.loggedOut)));
    });
  };
}

export function switchAccount(accountId, background = false) {
  return (dispatch, getState) => {
    const account = getState().getIn(['accounts', accountId]);
    dispatch({ type: SWITCH_ACCOUNT, account, background });
  };
}

export function fetchOwnAccounts() {
  return (dispatch, getState) => {
    const state = getState();
    state.getIn(['auth', 'users']).forEach(user => {
      const account = state.getIn(['accounts', user.get('id')]);
      if (!account) {
        dispatch(verifyCredentials(user.get('access_token'), user.get('url')));
      }
    });
  };
}

export function register(params) {
  return (dispatch, getState) => {
    params.fullname = params.username;

    return dispatch(createAppAndToken())
      .then(() => dispatch(createAccount(params)))
      .then(({ token }) => dispatch(authLoggedIn(token)));
  };
}

export function fetchCaptcha() {
  return (dispatch, getState) => {
    return api(getState).get('/api/pleroma/captcha');
  };
}

export function authLoggedIn(token) {
  return (dispatch, getState) => {
    dispatch({ type: AUTH_LOGGED_IN, token });
    return token;
  };
}
