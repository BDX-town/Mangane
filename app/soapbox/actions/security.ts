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

import type { AppDispatch, RootState } from 'soapbox/store';

const FETCH_TOKENS_REQUEST = 'FETCH_TOKENS_REQUEST';
const FETCH_TOKENS_SUCCESS = 'FETCH_TOKENS_SUCCESS';
const FETCH_TOKENS_FAIL    = 'FETCH_TOKENS_FAIL';

const REVOKE_TOKEN_REQUEST = 'REVOKE_TOKEN_REQUEST';
const REVOKE_TOKEN_SUCCESS = 'REVOKE_TOKEN_SUCCESS';
const REVOKE_TOKEN_FAIL    = 'REVOKE_TOKEN_FAIL';

const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
const RESET_PASSWORD_FAIL    = 'RESET_PASSWORD_FAIL';

const RESET_PASSWORD_CONFIRM_REQUEST = 'RESET_PASSWORD_CONFIRM_REQUEST';
const RESET_PASSWORD_CONFIRM_SUCCESS = 'RESET_PASSWORD_CONFIRM_SUCCESS';
const RESET_PASSWORD_CONFIRM_FAIL    = 'RESET_PASSWORD_CONFIRM_FAIL';

const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
const CHANGE_PASSWORD_FAIL    = 'CHANGE_PASSWORD_FAIL';

const CHANGE_EMAIL_REQUEST = 'CHANGE_EMAIL_REQUEST';
const CHANGE_EMAIL_SUCCESS = 'CHANGE_EMAIL_SUCCESS';
const CHANGE_EMAIL_FAIL    = 'CHANGE_EMAIL_FAIL';

const DELETE_ACCOUNT_REQUEST = 'DELETE_ACCOUNT_REQUEST';
const DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS';
const DELETE_ACCOUNT_FAIL    = 'DELETE_ACCOUNT_FAIL';

const MOVE_ACCOUNT_REQUEST = 'MOVE_ACCOUNT_REQUEST';
const MOVE_ACCOUNT_SUCCESS = 'MOVE_ACCOUNT_SUCCESS';
const MOVE_ACCOUNT_FAIL    = 'MOVE_ACCOUNT_FAIL';

const fetchOAuthTokens = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: FETCH_TOKENS_REQUEST });
    return api(getState).get('/api/oauth_tokens.json').then(({ data: tokens }) => {
      dispatch({ type: FETCH_TOKENS_SUCCESS, tokens });
    }).catch(() => {
      dispatch({ type: FETCH_TOKENS_FAIL });
    });
  };

const revokeOAuthTokenById = (id: number) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: REVOKE_TOKEN_REQUEST, id });
    return api(getState).delete(`/api/oauth_tokens/${id}`).then(() => {
      dispatch({ type: REVOKE_TOKEN_SUCCESS, id });
    }).catch(() => {
      dispatch({ type: REVOKE_TOKEN_FAIL, id });
    });
  };

const changePassword = (oldPassword: string, newPassword: string, confirmation: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    return api(getState).post('/api/v1/pleroma/change_password', {
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

const resetPassword = (usernameOrEmail: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const v = parseVersion(state.instance.version);

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

const resetPasswordConfirm = (password: string, token: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const params = { password, reset_password_token: token };
    dispatch({ type: RESET_PASSWORD_CONFIRM_REQUEST });

    return api(getState).post('/api/v1/truth/password_reset/confirm', params).then(() => {
      dispatch({ type: RESET_PASSWORD_CONFIRM_SUCCESS });
    }).catch(error => {
      dispatch({ type: RESET_PASSWORD_CONFIRM_FAIL, error });
      throw error;
    });
  };

const changeEmail = (email: string, password: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: CHANGE_EMAIL_REQUEST, email });
    return api(getState).post('/api/v1/pleroma/change_email', {
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

const confirmChangedEmail = (token: string) =>
  (_dispatch: AppDispatch, getState: () => RootState) =>
    api(getState).get(`/api/v1/truth/email/confirm?confirmation_token=${token}`);

const deleteAccount = (password: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const account = getLoggedInAccount(getState());

    dispatch({ type: DELETE_ACCOUNT_REQUEST });
    return api(getState).post('/api/v1/pleroma/delete_account', {
      password,
    }).then(response => {
      if (response.data.error) throw response.data.error; // This endpoint returns HTTP 200 even on failure
      dispatch({ type: DELETE_ACCOUNT_SUCCESS, response });
      dispatch({ type: AUTH_LOGGED_OUT, account });
      dispatch(snackbar.success(messages.loggedOut));
    }).catch(error => {
      dispatch({ type: DELETE_ACCOUNT_FAIL, error, skipAlert: true });
      throw error;
    });
  };

const moveAccount = (targetAccount: string, password: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: MOVE_ACCOUNT_REQUEST });
    return api(getState).post('/api/v1/pleroma/move_account', {
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

export {
  FETCH_TOKENS_REQUEST,
  FETCH_TOKENS_SUCCESS,
  FETCH_TOKENS_FAIL,
  REVOKE_TOKEN_REQUEST,
  REVOKE_TOKEN_SUCCESS,
  REVOKE_TOKEN_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_REQUEST,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  CHANGE_EMAIL_REQUEST,
  CHANGE_EMAIL_SUCCESS,
  CHANGE_EMAIL_FAIL,
  DELETE_ACCOUNT_REQUEST,
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_FAIL,
  MOVE_ACCOUNT_REQUEST,
  MOVE_ACCOUNT_SUCCESS,
  MOVE_ACCOUNT_FAIL,
  fetchOAuthTokens,
  revokeOAuthTokenById,
  changePassword,
  resetPassword,
  resetPasswordConfirm,
  changeEmail,
  confirmChangedEmail,
  deleteAccount,
  moveAccount,
};
