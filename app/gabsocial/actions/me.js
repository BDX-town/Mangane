import api from '../api';
import { importFetchedAccount } from './importer';

export const ME_FETCH_REQUEST = 'ME_FETCH_REQUEST';
export const ME_FETCH_SUCCESS = 'ME_FETCH_SUCCESS';
export const ME_FETCH_FAIL    = 'ME_FETCH_FAIL';
export const ME_FETCH_SKIP    = 'ME_FETCH_SKIP';

export function fetchMe() {
  return (dispatch, getState) => {
    const accessToken = getState().getIn(['auth', 'user', 'access_token']);
    if (!accessToken) {
      dispatch({ type: ME_FETCH_SKIP });
      return;
    };
    dispatch(fetchMeRequest());
    api(getState).get('/api/v1/accounts/verify_credentials').then(response => {
      dispatch(fetchMeSuccess(response.data));
      dispatch(importFetchedAccount(response.data));
    }).catch(error => {
      dispatch(fetchMeFail(error));
    });
  };
}

export function fetchMeRequest() {
  return {
    type: ME_FETCH_REQUEST,
  };
}

export function fetchMeSuccess(me) {
  return {
    type: ME_FETCH_SUCCESS,
    me,
  };
}

export function fetchMeFail(error) {
  return {
    type: ME_FETCH_FAIL,
    error,
    skipAlert: true,
  };
};
