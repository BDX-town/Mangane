/**
 * Security: Pleroma-specific account management features.
 * @module soapbox/actions/security
 * @see module:soapbox/actions/auth
 */

import snackbar from 'soapbox/actions/snackbar';
import { getLoggedInAccount } from 'soapbox/utils/auth';
import { parseVersion, TRUTHSOCIAL } from 'soapbox/utils/features';

import api from '../api';

import { AUTH_LOGGED_OUT, messages } from './auth';

export const FETCH_TOKENS_REQUEST = 'FETCH_TOKENS_REQUEST';
export const FETCH_TOKENS_SUCCESS = 'FETCH_TOKENS_SUCCESS';
export const FETCH_TOKENS_FAIL    = 'FETCH_TOKENS_FAIL';

export const REVOKE_TOKEN_REQUEST = 'REVOKE_TOKEN_REQUEST';
export const REVOKE_TOKEN_SUCCESS = 'REVOKE_TOKEN_SUCCESS';
export const REVOKE_TOKEN_FAIL    = 'REVOKE_TOKEN_FAIL';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAIL    = 'RESET_PASSWORD_FAIL';

export const RESET_PASSWORD_CONFIRM_REQUEST = 'RESET_PASSWORD_CONFIRM_REQUEST';
export const RESET_PASSWORD_CONFIRM_SUCCESS = 'RESET_PASSWORD_CONFIRM_SUCCESS';
export const RESET_PASSWORD_CONFIRM_FAIL    = 'RESET_PASSWORD_CONFIRM_FAIL';

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL    = 'CHANGE_PASSWORD_FAIL';

export const CHANGE_EMAIL_REQUEST = 'CHANGE_EMAIL_REQUEST';
export const CHANGE_EMAIL_SUCCESS = 'CHANGE_EMAIL_SUCCESS';
export const CHANGE_EMAIL_FAIL    = 'CHANGE_EMAIL_FAIL';

export const DELETE_ACCOUNT_REQUEST = 'DELETE_ACCOUNT_REQUEST';
export const DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS';
export const DELETE_ACCOUNT_FAIL    = 'DELETE_ACCOUNT_FAIL';

export const MOVE_ACCOUNT_REQUEST = 'MOVE_ACCOUNT_REQUEST';
export const MOVE_ACCOUNT_SUCCESS = 'MOVE_ACCOUNT_SUCCESS';
export const MOVE_ACCOUNT_FAIL    = 'MOVE_ACCOUNT_FAIL';

export function fetchOAuthTokens() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_TOKENS_REQUEST });
    return api(getState).get('/api/oauth_tokens.json').then(({ data: tokens }) => {
      dispatch({ type: FETCH_TOKENS_SUCCESS, tokens });
    }).catch(error => {
      dispatch({ type: FETCH_TOKENS_FAIL });
    });
  };
}

export function revokeOAuthTokenById(id) {
  return (dispatch, getState) => {
    dispatch({ type: REVOKE_TOKEN_REQUEST, id });
    return api(getState).delete(`/api/oauth_tokens/${id}`).then(() => {
      dispatch({ type: REVOKE_TOKEN_SUCCESS, id });
    }).catch(error => {
      dispatch({ type: REVOKE_TOKEN_FAIL, id });
    });
  };
}

export function changePassword(oldPassword, newPassword, confirmation) {
  return (dispatch, getState) => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    return api(getState).post('/api/pleroma/change_password', {
      password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: confirmation,
    }).then(response => {
      if (response.data.error) throw response.data.error; // This endpoint returns HTTP 200 even on failure
      dispatch({ type: CHANGE_PASSWORD_SUCCESS, response });
    }).catch(error => {
      dispatch({ type: CHANGE_PASSWORD_FAIL, error, skipAlert: true });
      throw error;
    });
  };
}

export function resetPassword(usernameOrEmail) {
  return (dispatch, getState) => {
    const state = getState();
    const v = parseVersion(state.instance);

    dispatch({ type: RESET_PASSWORD_REQUEST });

    const params =
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { nickname: usernameOrEmail, username: usernameOrEmail };

    const endpoint =
      v.software === TRUTHSOCIAL
        ? '/api/v1/truth/password_reset/request'
        : '/auth/password';

    return api(getState).post(endpoint, params).then(() => {
      dispatch({ type: RESET_PASSWORD_SUCCESS });
    }).catch(error => {
      dispatch({ type: RESET_PASSWORD_FAIL, error });
      throw error;
    });
  };
}

export function resetPasswordConfirm(password, token) {
  return (dispatch, getState) => {
    const params = { password, reset_password_token: token };
    dispatch({ type: RESET_PASSWORD_CONFIRM_REQUEST });

    return api(getState).post('/api/v1/truth/password_reset/confirm', params).then(() => {
      dispatch({ type: RESET_PASSWORD_CONFIRM_SUCCESS });
    }).catch(error => {
      dispatch({ type: RESET_PASSWORD_CONFIRM_FAIL, error });
      throw error;
    });
  };
}

export function changeEmail(email, password) {
  return (dispatch, getState) => {
    dispatch({ type: CHANGE_EMAIL_REQUEST, email });
    return api(getState).post('/api/pleroma/change_email', {
      email,
      password,
    }).then(response => {
      if (response.data.error) throw response.data.error; // This endpoint returns HTTP 200 even on failure
      dispatch({ type: CHANGE_EMAIL_SUCCESS, email, response });
    }).catch(error => {
      dispatch({ type: CHANGE_EMAIL_FAIL, email, error, skipAlert: true });
      throw error;
    });
  };
}

export function confirmChangedEmail(token) {
  return (_dispatch, getState) => {
    return api(getState).get(`/api/v1/truth/email/confirm?confirmation_token=${token}`);
  };
}

export function deleteAccount(intl, password) {
  return (dispatch, getState) => {
    const account = getLoggedInAccount(getState());

    dispatch({ type: DELETE_ACCOUNT_REQUEST });
    return api(getState).post('/api/pleroma/delete_account', {
      password,
    }).then(response => {
      if (response.data.error) throw response.data.error; // This endpoint returns HTTP 200 even on failure
      dispatch({ type: DELETE_ACCOUNT_SUCCESS, response });
      dispatch({ type: AUTH_LOGGED_OUT, account });
      dispatch(snackbar.success(intl.formatMessage(messages.loggedOut)));
    }).catch(error => {
      dispatch({ type: DELETE_ACCOUNT_FAIL, error, skipAlert: true });
      throw error;
    });
  };
}

export function moveAccount(targetAccount, password) {
  return (dispatch, getState) => {
    dispatch({ type: MOVE_ACCOUNT_REQUEST });
    return api(getState).post('/api/pleroma/move_account', {
      password,
      target_account: targetAccount,
    }).then(response => {
      if (response.data.error) throw response.data.error; // This endpoint returns HTTP 200 even on failure
      dispatch({ type: MOVE_ACCOUNT_SUCCESS, response });
    }).catch(error => {
      dispatch({ type: MOVE_ACCOUNT_FAIL, error, skipAlert: true });
      throw error;
    });
  };
}
