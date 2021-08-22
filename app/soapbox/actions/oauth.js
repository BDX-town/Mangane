import { baseClient } from '../api';

export const OAUTH_TOKEN_CREATE_REQUEST = 'OAUTH_TOKEN_CREATE_REQUEST';
export const OAUTH_TOKEN_CREATE_SUCCESS = 'OAUTH_TOKEN_CREATE_SUCCESS';
export const OAUTH_TOKEN_CREATE_FAIL    = 'OAUTH_TOKEN_CREATE_FAIL';

export const OAUTH_TOKEN_REVOKE_REQUEST = 'OAUTH_TOKEN_REVOKE_REQUEST';
export const OAUTH_TOKEN_REVOKE_SUCCESS = 'OAUTH_TOKEN_REVOKE_SUCCESS';
export const OAUTH_TOKEN_REVOKE_FAIL    = 'OAUTH_TOKEN_REVOKE_FAIL';

export function obtainOAuthToken(params) {
  return (dispatch, getState) => {
    dispatch({ type: OAUTH_TOKEN_CREATE_REQUEST, params });
    return baseClient().post('/oauth/token', params).then(({ data: token }) => {
      dispatch({ type: OAUTH_TOKEN_CREATE_SUCCESS, params, token });
      return token;
    }).catch(error => {
      dispatch({ type: OAUTH_TOKEN_CREATE_FAIL, params, error });
      throw error;
    });
  };
}

export function revokeOAuthToken(params) {
  return (dispatch, getState) => {
    dispatch({ type: OAUTH_TOKEN_REVOKE_REQUEST, params });
    return baseClient().post('/oauth/revoke', params).then(({ data }) => {
      dispatch({ type: OAUTH_TOKEN_REVOKE_SUCCESS, params, data });
      return data;
    }).catch(error => {
      dispatch({ type: OAUTH_TOKEN_REVOKE_FAIL, params, error });
      throw error;
    });
  };
}
