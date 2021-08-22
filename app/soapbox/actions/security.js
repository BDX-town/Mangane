import api from '../api';

export const FETCH_TOKENS_REQUEST = 'FETCH_TOKENS_REQUEST';
export const FETCH_TOKENS_SUCCESS = 'FETCH_TOKENS_SUCCESS';
export const FETCH_TOKENS_FAIL    = 'FETCH_TOKENS_FAIL';

export const REVOKE_TOKEN_REQUEST = 'REVOKE_TOKEN_REQUEST';
export const REVOKE_TOKEN_SUCCESS = 'REVOKE_TOKEN_SUCCESS';
export const REVOKE_TOKEN_FAIL    = 'REVOKE_TOKEN_FAIL';

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
