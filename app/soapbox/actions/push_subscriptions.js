import api from '../api';

export const PUSH_SUBSCRIPTION_CREATE_REQUEST = 'PUSH_SUBSCRIPTION_CREATE_REQUEST';
export const PUSH_SUBSCRIPTION_CREATE_SUCCESS = 'PUSH_SUBSCRIPTION_CREATE_SUCCESS';
export const PUSH_SUBSCRIPTION_CREATE_FAIL    = 'PUSH_SUBSCRIPTION_CREATE_FAIL';

export const PUSH_SUBSCRIPTION_FETCH_REQUEST = 'PUSH_SUBSCRIPTION_FETCH_REQUEST';
export const PUSH_SUBSCRIPTION_FETCH_SUCCESS = 'PUSH_SUBSCRIPTION_FETCH_SUCCESS';
export const PUSH_SUBSCRIPTION_FETCH_FAIL    = 'PUSH_SUBSCRIPTION_FETCH_FAIL';

export const PUSH_SUBSCRIPTION_UPDATE_REQUEST = 'PUSH_SUBSCRIPTION_UPDATE_REQUEST';
export const PUSH_SUBSCRIPTION_UPDATE_SUCCESS = 'PUSH_SUBSCRIPTION_UPDATE_SUCCESS';
export const PUSH_SUBSCRIPTION_UPDATE_FAIL    = 'PUSH_SUBSCRIPTION_UPDATE_FAIL';

export const PUSH_SUBSCRIPTION_DELETE_REQUEST = 'PUSH_SUBSCRIPTION_DELETE_REQUEST';
export const PUSH_SUBSCRIPTION_DELETE_SUCCESS = 'PUSH_SUBSCRIPTION_DELETE_SUCCESS';
export const PUSH_SUBSCRIPTION_DELETE_FAIL    = 'PUSH_SUBSCRIPTION_DELETE_FAIL';

export function createPushSubsription(params) {
  return (dispatch, getState) => {
    dispatch({ type: PUSH_SUBSCRIPTION_CREATE_REQUEST, params });
    return api(getState).post('/api/v1/push/subscription', params).then(({ data: subscription }) => {
      dispatch({ type: PUSH_SUBSCRIPTION_CREATE_SUCCESS, params, subscription });
    }).catch(error => {
      dispatch({ type: PUSH_SUBSCRIPTION_CREATE_FAIL, params, error });
    });
  };
}

export function fetchPushSubsription() {
  return (dispatch, getState) => {
    dispatch({ type: PUSH_SUBSCRIPTION_FETCH_REQUEST });
    return api(getState).get('/api/v1/push/subscription').then(({ data: subscription }) => {
      dispatch({ type: PUSH_SUBSCRIPTION_FETCH_SUCCESS, subscription });
    }).catch(error => {
      dispatch({ type: PUSH_SUBSCRIPTION_FETCH_FAIL, error });
    });
  };
}

export function updatePushSubsription(params) {
  return (dispatch, getState) => {
    dispatch({ type: PUSH_SUBSCRIPTION_UPDATE_REQUEST, params });
    return api(getState).put('/api/v1/push/subscription', params).then(({ data: subscription }) => {
      dispatch({ type: PUSH_SUBSCRIPTION_UPDATE_SUCCESS, params, subscription });
    }).catch(error => {
      dispatch({ type: PUSH_SUBSCRIPTION_UPDATE_FAIL, params, error });
    });
  };
}

export function deletePushSubsription() {
  return (dispatch, getState) => {
    dispatch({ type: PUSH_SUBSCRIPTION_DELETE_REQUEST });
    return api(getState).delete('/api/v1/push/subscription').then(() => {
      dispatch({ type: PUSH_SUBSCRIPTION_DELETE_SUCCESS });
    }).catch(error => {
      dispatch({ type: PUSH_SUBSCRIPTION_DELETE_FAIL, error });
    });
  };
}
