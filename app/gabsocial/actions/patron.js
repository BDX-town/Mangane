import api from '../api';

export const PATRON_FUNDING_IMPORT        = 'PATRON_FUNDING_IMPORT';
export const PATRON_FUNDING_FETCH_FAIL    = 'PATRON_FUNDING_FETCH_FAIL';

export function fetchFunding() {
  return (dispatch, getState) => {
    api(getState).get('/patron/v1/funding').then(response => {
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
    funding,
  };
}

export function fetchFundingFail(error) {
  return {
    type: PATRON_FUNDING_FETCH_FAIL,
    error,
    skipAlert: true,
  };
};
