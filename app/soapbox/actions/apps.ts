/**
 * Apps: manage OAuth applications.
 * Particularly useful for auth.
 * https://docs.joinmastodon.org/methods/apps/
 * @module soapbox/actions/apps
 * @see module:soapbox/actions/auth
 */

import { baseClient } from '../api';

import type { AnyAction } from 'redux';

export const APP_CREATE_REQUEST = 'APP_CREATE_REQUEST';
export const APP_CREATE_SUCCESS = 'APP_CREATE_SUCCESS';
export const APP_CREATE_FAIL    = 'APP_CREATE_FAIL';

export const APP_VERIFY_CREDENTIALS_REQUEST = 'APP_VERIFY_CREDENTIALS_REQUEST';
export const APP_VERIFY_CREDENTIALS_SUCCESS = 'APP_VERIFY_CREDENTIALS_SUCCESS';
export const APP_VERIFY_CREDENTIALS_FAIL    = 'APP_VERIFY_CREDENTIALS_FAIL';

export function createApp(params?: Record<string, string>, baseURL?: string) {
  return (dispatch: React.Dispatch<AnyAction>) => {
    dispatch({ type: APP_CREATE_REQUEST, params });
    return baseClient(null, baseURL).post('/api/v1/apps', params).then(({ data: app }) => {
      dispatch({ type: APP_CREATE_SUCCESS, params, app });
      return app as Record<string, string>;
    }).catch(error => {
      dispatch({ type: APP_CREATE_FAIL, params, error });
      throw error;
    });
  };
}

export function verifyAppCredentials(token: string) {
  return (dispatch: React.Dispatch<AnyAction>) => {
    dispatch({ type: APP_VERIFY_CREDENTIALS_REQUEST, token });
    return baseClient(token).get('/api/v1/apps/verify_credentials').then(({ data: app }) => {
      dispatch({ type: APP_VERIFY_CREDENTIALS_SUCCESS, token, app });
      return app;
    }).catch(error => {
      dispatch({ type: APP_VERIFY_CREDENTIALS_FAIL, token, error });
      throw error;
    });
  };
}
