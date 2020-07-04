import api from '../api';

export const PATRON_INSTANCE_FETCH_REQUEST = 'PATRON_INSTANCE_FETCH_REQUEST';
export const PATRON_INSTANCE_FETCH_SUCCESS = 'PATRON_INSTANCE_FETCH_SUCCESS';
export const PATRON_INSTANCE_FETCH_FAIL =    'PATRON_INSTANCE_FETCH_FAIL';

export function fetchPatronInstance() {
  return (dispatch, getState) => {
    dispatch({ type: PATRON_INSTANCE_FETCH_REQUEST });
    api(getState).get('/api/patron/v1/instance').then(response => {
      dispatch(importFetchedFunding(response.data));
    }).catch(error => {
      dispatch(fetchFundingFail(error));
    });
  };
};

export function importFetchedFunding(instance) {
  return {
    type: PATRON_INSTANCE_FETCH_SUCCESS,
    instance,
  };
}

export function fetchFundingFail(error) {
  return {
    type: PATRON_INSTANCE_FETCH_FAIL,
    error,
    skipAlert: true,
  };
};
