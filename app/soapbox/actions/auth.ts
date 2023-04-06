/**
 * Auth: login & registration workflow.
 * This file contains abstractions over auth concepts.
 * @module soapbox/actions/auth
 * @see module:soapbox/actions/apps
 * @see module:soapbox/actions/oauth
 * @see module:soapbox/actions/security
 */

import { defineMessages } from 'react-intl';

import { createAccount } from 'soapbox/actions/accounts';
import { createApp } from 'soapbox/actions/apps';
import { fetchMeSuccess, fetchMeFail } from 'soapbox/actions/me';
import { obtainOAuthToken, revokeOAuthToken } from 'soapbox/actions/oauth';
import { startOnboarding } from 'soapbox/actions/onboarding';
import snackbar from 'soapbox/actions/snackbar';
import { custom } from 'soapbox/custom';
import KVStore from 'soapbox/storage/kv_store';
import { getLoggedInAccount, parseBaseURL } from 'soapbox/utils/auth';
import sourceCode from 'soapbox/utils/code';
import { getFeatures } from 'soapbox/utils/features';
import { isStandalone } from 'soapbox/utils/state';

import api, { baseClient } from '../api';

import { importFetchedAccount } from './importer';

import type { AxiosError } from 'axios';
import type { Map as ImmutableMap } from 'immutable';
import type { AppDispatch, RootState } from 'soapbox/store';

export const SWITCH_ACCOUNT = 'SWITCH_ACCOUNT';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';

export const VERIFY_CREDENTIALS_REQUEST = 'VERIFY_CREDENTIALS_REQUEST';
export const VERIFY_CREDENTIALS_SUCCESS = 'VERIFY_CREDENTIALS_SUCCESS';
export const VERIFY_CREDENTIALS_FAIL    = 'VERIFY_CREDENTIALS_FAIL';

export const AUTH_ACCOUNT_REMEMBER_REQUEST = 'AUTH_ACCOUNT_REMEMBER_REQUEST';
export const AUTH_ACCOUNT_REMEMBER_SUCCESS = 'AUTH_ACCOUNT_REMEMBER_SUCCESS';
export const AUTH_ACCOUNT_REMEMBER_FAIL    = 'AUTH_ACCOUNT_REMEMBER_FAIL';

const customApp = custom('app');

export const messages = defineMessages({
  loggedOut: { id: 'auth.logged_out', defaultMessage: 'Logged out.' },
  invalidCredentials: { id: 'auth.invalid_credentials', defaultMessage: 'Wrong username or password' },
});

const noOp = () => new Promise(f => f(undefined));

const getScopes = (state: RootState) => {
  const instance = state.instance;
  const { scopes } = getFeatures(instance);
  return scopes;
};

const createAppAndToken = () =>
  (dispatch: AppDispatch) =>
    dispatch(getAuthApp()).then(() =>
      dispatch(createAppToken()),
    );

/** Create an auth app, or use it from build config */
const getAuthApp = () =>
  (dispatch: AppDispatch) => {
    if (customApp?.client_secret) {
      return noOp().then(() => dispatch({ type: AUTH_APP_CREATED, app: customApp }));
    } else {
      return dispatch(createAuthApp());
    }
  };

const createAuthApp = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const params = {
      client_name:   sourceCode.displayName,
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes:        getScopes(getState()),
      website:       sourceCode.homepage,
    };

    return dispatch(createApp(params)).then((app: Record<string, string>) =>
      dispatch({ type: AUTH_APP_CREATED, app }),
    );
  };

const createAppToken = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const app = getState().auth.get('app');

    const params = {
      client_id:     app.get('client_id'),
      client_secret: app.get('client_secret'),
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'client_credentials',
      scope:         getScopes(getState()),
    };

    return dispatch(obtainOAuthToken(params)).then((token: Record<string, string | number>) =>
      dispatch({ type: AUTH_APP_AUTHORIZED, app, token }),
    );
  };

const createUserToken = (username: string, password: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const app = getState().auth.get('app');

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
      .then((token: Record<string, string | number>) => dispatch(authLoggedIn(token)));
  };

export const refreshUserToken = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const refreshToken = getState().auth.getIn(['user', 'refresh_token']);
    const app = getState().auth.get('app');

    if (!refreshToken) return dispatch(noOp);

    const params = {
      client_id:     app.get('client_id'),
      client_secret: app.get('client_secret'),
      refresh_token: refreshToken,
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'refresh_token',
      scope:         getScopes(getState()),
    };

    return dispatch(obtainOAuthToken(params))
      .then((token: Record<string, string | number>) => dispatch(authLoggedIn(token)));
  };

export const otpVerify = (code: string, mfa_token: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const app = getState().auth.get('app');
    return api(getState, 'app').post('/oauth/mfa/challenge', {
      client_id: app.get('client_id'),
      client_secret: app.get('client_secret'),
      mfa_token: mfa_token,
      code: code,
      challenge_type: 'totp',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      scope: getScopes(getState()),
    }).then(({ data: token }) => dispatch(authLoggedIn(token)));
  };

export const verifyCredentials = (token: string, accountUrl?: string) => {
  const baseURL = parseBaseURL(accountUrl);

  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: VERIFY_CREDENTIALS_REQUEST, token });

    return baseClient(token, baseURL).get('/api/v1/accounts/verify_credentials').then(({ data: account }) => {
      dispatch(importFetchedAccount(account));
      dispatch({ type: VERIFY_CREDENTIALS_SUCCESS, token, account });
      if (account.id === getState().me) dispatch(fetchMeSuccess(account));
      return account;
    }).catch(error => {
      if (error?.response?.status === 403 && error?.response?.data?.id) {
        // The user is waitlisted
        const account = error.response.data;
        dispatch(importFetchedAccount(account));
        dispatch({ type: VERIFY_CREDENTIALS_SUCCESS, token, account });
        if (account.id === getState().me) dispatch(fetchMeSuccess(account));
        return account;
      } else {
        if (getState().me === null) dispatch(fetchMeFail(error));
        dispatch({ type: VERIFY_CREDENTIALS_FAIL, token, error });
        throw error;
      }
    });
  };
};

export const rememberAuthAccount = (accountUrl: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: AUTH_ACCOUNT_REMEMBER_REQUEST, accountUrl });
    return KVStore.getItemOrError(`authAccount:${accountUrl}`).then(account => {
      dispatch(importFetchedAccount(account));
      dispatch({ type: AUTH_ACCOUNT_REMEMBER_SUCCESS, account, accountUrl });
      if (account.id === getState().me) dispatch(fetchMeSuccess(account));
      return account;
    }).catch(error => {
      dispatch({ type: AUTH_ACCOUNT_REMEMBER_FAIL, error, accountUrl, skipAlert: true });
    });
  };

export const loadCredentials = (token: string, accountUrl: string) =>
  (dispatch: AppDispatch) => dispatch(rememberAuthAccount(accountUrl))
    .then(() => {
      dispatch(verifyCredentials(token, accountUrl));
    })
    .catch(() => dispatch(verifyCredentials(token, accountUrl)));

/** Trim the username and strip the leading @. */
const normalizeUsername = (username: string): string => {
  const trimmed = username.trim();
  if (trimmed[0] === '@') {
    return trimmed.slice(1);
  } else {
    return trimmed;
  }
};

export const logIn = (username: string, password: string) =>
  (dispatch: AppDispatch) => dispatch(getAuthApp()).then(() => {
    return dispatch(createUserToken(normalizeUsername(username), password));
  }).catch((error: AxiosError) => {
    if ((error.response?.data as any).error === 'mfa_required') {
      // If MFA is required, throw the error and handle it in the component.
      throw error;
    } else {
      // Return "wrong password" message.
      dispatch(snackbar.error(messages.invalidCredentials));
    }
    throw error;
  });

export const deleteSession = () =>
  (dispatch: AppDispatch, getState: () => RootState) => api(getState).delete('/api/sign_out');

export const logOut = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const account = getLoggedInAccount(state);
    const standalone = isStandalone(state);

    if (!account) return dispatch(noOp);

    const params = {
      client_id: state.auth.getIn(['app', 'client_id']),
      client_secret: state.auth.getIn(['app', 'client_secret']),
      token: state.auth.getIn(['users', account.url, 'access_token']),
    };

    return dispatch(revokeOAuthToken(params)).finally(() => {
      dispatch({ type: AUTH_LOGGED_OUT, account, standalone });
      return dispatch(snackbar.success(messages.loggedOut));
    });
  };

export const switchAccount = (accountId: string, background = false) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const account = getState().accounts.get(accountId);
    return dispatch({ type: SWITCH_ACCOUNT, account, background });
  };

export const fetchOwnAccounts = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    return state.auth.get('users').forEach((user: ImmutableMap<string, string>) => {
      const account = state.accounts.get(user.get('id'));
      if (!account) {
        dispatch(verifyCredentials(user.get('access_token')!, user.get('url')));
      }
    });
  };

export const register = (params: Record<string, any>) =>
  (dispatch: AppDispatch) => {
    params.fullname = params.username;

    return dispatch(createAppAndToken())
      .then(() => dispatch(createAccount(params)))
      .then(({ token }: { token: Record<string, string | number> }) => {
        dispatch(startOnboarding());
        return dispatch(authLoggedIn(token));
      });
  };

export const fetchCaptcha = () =>
  (_dispatch: AppDispatch, getState: () => RootState) => {
    return api(getState).get('/api/v1/pleroma/captcha');
  };

export const authLoggedIn = (token: Record<string, string | number>) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: AUTH_LOGGED_IN, token });
    return token;
  };
