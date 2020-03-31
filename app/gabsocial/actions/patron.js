import api, { getLinks } from '../api';
import openDB from '../storage/db';
import { me } from 'gabsocial/initial_state';

export const PATRON_FUNDING_FETCH_REQUEST = 'PATRON_FUNDING_FETCH_REQUEST';
export const PATRON_FUNDING_FETCH_SUCCESS = 'PATRON_FUNDING_FETCH_SUCCESS';
export const PATRON_FUNDING_FETCH_FAIL    = 'PATRON_FUNDING_FETCH_FAIL';
export const PATRON_FUNDING_IMPORT        = 'PATRON_FUNDING_IMPORT';

export function fetchFunding() {
  return (dispatch, getState) => {
    api(getState).get(`/patron/v1/funding`).then(response => {
      dispatch(importFetchedFunding(response.data));
    }).then(() => {
      dispatch(fetchFundingSuccess());
    }).catch(error => {
      dispatch(fetchFundingFail(error));
    });
  };
};

export function importFetchedFunding(funding) {
  return {
    type: PATRON_FUNDING_IMPORT,
    funding
  };
}

export function fetchFundingRequest() {
  return {
    type: PATRON_FUNDING_FETCH_REQUEST,
  };
};

export function fetchAccountSuccess() {
  return {
    type: PATRON_FUNDING_FETCH_SUCCESS,
  };
};

export function fetchFundingFail(error) {
  return {
    type: PATRON_FUNDING_FETCH_FAIL,
    error,
    skipAlert: true,
  };
};
