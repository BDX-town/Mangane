import KVStore from 'soapbox/storage/kv_store';
import { getAuthUserId, getAuthUserUrl } from 'soapbox/utils/auth';

import api from '../api';

import { loadCredentials } from './auth';
import { importFetchedAccount } from './importer';

export const ME_FETCH_REQUEST = 'ME_FETCH_REQUEST';
export const ME_FETCH_SUCCESS = 'ME_FETCH_SUCCESS';
export const ME_FETCH_FAIL    = 'ME_FETCH_FAIL';
export const ME_FETCH_SKIP    = 'ME_FETCH_SKIP';

export const ME_PATCH_REQUEST = 'ME_PATCH_REQUEST';
export const ME_PATCH_SUCCESS = 'ME_PATCH_SUCCESS';
export const ME_PATCH_FAIL    = 'ME_PATCH_FAIL';

const noOp = () => new Promise(f => f());

const getMeId = state => state.get('me') || getAuthUserId(state);

const getMeUrl = state => {
  const accountId = getMeId(state);
  return state.getIn(['accounts', accountId, 'url']) || getAuthUserUrl(state);
};

const getMeToken = state => {
  // Fallback for upgrading IDs to URLs
  const accountUrl = getMeUrl(state) || state.getIn(['auth', 'me']);
  return state.getIn(['auth', 'users', accountUrl, 'access_token']);
};

export function fetchMe() {
  return (dispatch, getState) => {
    const state = getState();
    const token = getMeToken(state);
    const accountUrl = getMeUrl(state);

    if (!token) {
      dispatch({ type: ME_FETCH_SKIP }); return noOp();
    }

    dispatch(fetchMeRequest());
    return dispatch(loadCredentials(token, accountUrl)).catch(error => {
      dispatch(fetchMeFail(error));
    });
  };
}

/** Update the auth account in IndexedDB for Mastodon, etc. */
const persistAuthAccount = (account, params) => {
  if (account && account.url) {
    if (!account.pleroma) account.pleroma = {};

    if (!account.pleroma.settings_store) {
      account.pleroma.settings_store = params.pleroma_settings_store || {};
    }
    KVStore.setItem(`authAccount:${account.url}`, account).catch(console.error);
  }
};

export function patchMe(params) {
  return (dispatch, getState) => {
    dispatch(patchMeRequest());

    return api(getState)
      .patch('/api/v1/accounts/update_credentials', params)
      .then(response => {
        persistAuthAccount(response.data, params);
        dispatch(patchMeSuccess(response.data));
      }).catch(error => {
        dispatch(patchMeFail(error));
        throw error;
      });
  };
}

export function fetchMeRequest() {
  return {
    type: ME_FETCH_REQUEST,
  };
}

export function fetchMeSuccess(me) {
  return (dispatch, getState) => {
    dispatch({
      type: ME_FETCH_SUCCESS,
      me,
    });
  };
}

export function fetchMeFail(error) {
  return {
    type: ME_FETCH_FAIL,
    error,
    skipAlert: true,
  };
}

export function patchMeRequest() {
  return {
    type: ME_PATCH_REQUEST,
  };
}

export function patchMeSuccess(me) {
  return (dispatch, getState) => {
    dispatch(importFetchedAccount(me));
    dispatch({
      type: ME_PATCH_SUCCESS,
      me,
    });
  };
}

export function patchMeFail(error) {
  return {
    type: ME_PATCH_FAIL,
    error,
    skipAlert: true,
  };
}
