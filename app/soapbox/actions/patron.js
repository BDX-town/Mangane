import axios from 'axios';

export const PATRON_FUNDING_IMPORT        = 'PATRON_FUNDING_IMPORT';
export const PATRON_FUNDING_FETCH_FAIL    = 'PATRON_FUNDING_FETCH_FAIL';

export function fetchFunding() {
  return (dispatch, getState) => {
    const baseUrl = getState().getIn(['soapbox', 'extensions', 'patron', 'baseUrl']);
    axios.get(`${baseUrl}/api/patron/v1/instance`).then(response => {
      dispatch(importFetchedFunding(response.data));
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
