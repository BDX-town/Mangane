import api from '../api';

export const PATRON_INSTANCE_FETCH_REQUEST = 'PATRON_INSTANCE_FETCH_REQUEST';
export const PATRON_INSTANCE_FETCH_SUCCESS = 'PATRON_INSTANCE_FETCH_SUCCESS';
export const PATRON_INSTANCE_FETCH_FAIL    = 'PATRON_INSTANCE_FETCH_FAIL';

export const PATRON_ACCOUNT_FETCH_REQUEST  = 'PATRON_ACCOUNT_FETCH_REQUEST';
export const PATRON_ACCOUNT_FETCH_SUCCESS  = 'PATRON_ACCOUNT_FETCH_SUCCESS';
export const PATRON_ACCOUNT_FETCH_FAIL     = 'PATRON_ACCOUNT_FETCH_FAIL';

export function fetchPatronInstance() {
  return (dispatch, getState) => {
    dispatch({ type: PATRON_INSTANCE_FETCH_REQUEST });
    api(getState).get('/api/patron/v1/instance').then(response => {
      dispatch(importFetchedInstance(response.data));
    }).catch(error => {
      dispatch(fetchInstanceFail(error));
    });
  };
}

export function fetchPatronAccount(apId) {
  return (dispatch, getState) => {
    apId = encodeURIComponent(apId);
    dispatch({ type: PATRON_ACCOUNT_FETCH_REQUEST });
    api(getState).get(`/api/patron/v1/accounts/${apId}`).then(response => {
      dispatch(importFetchedAccount(response.data));
    }).catch(error => {
      dispatch(fetchAccountFail(error));
    });
  };
}

function importFetchedInstance(instance) {
  return {
    type: PATRON_INSTANCE_FETCH_SUCCESS,
    instance,
  };
}

function fetchInstanceFail(error) {
  return {
    type: PATRON_INSTANCE_FETCH_FAIL,
    error,
    skipAlert: true,
  };
}

function importFetchedAccount(account) {
  return {
    type: PATRON_ACCOUNT_FETCH_SUCCESS,
    account,
  };
}

function fetchAccountFail(error) {
  return {
    type: PATRON_ACCOUNT_FETCH_FAIL,
    error,
    skipAlert: true,
  };
}
