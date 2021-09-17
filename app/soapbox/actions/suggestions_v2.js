import api from '../api';
import { importFetchedAccount } from './importer';

export const SUGGESTIONS_V2_FETCH_REQUEST = 'SUGGESTIONS_V2_FETCH_REQUEST';
export const SUGGESTIONS_V2_FETCH_SUCCESS = 'SUGGESTIONS_V2_FETCH_SUCCESS';
export const SUGGESTIONS_V2_FETCH_FAIL    = 'SUGGESTIONS_V2_FETCH_FAIL';

export function fetchSuggestions() {
  return (dispatch, getState) => {
    dispatch({ type: SUGGESTIONS_V2_FETCH_REQUEST, skipLoading: true });
    api(getState).get('/api/v2/suggestions').then(({ data: suggestions }) => {
      suggestions.forEach(({ account }) => dispatch(importFetchedAccount(account)));
      dispatch({ type: SUGGESTIONS_V2_FETCH_SUCCESS, suggestions, skipLoading: true });
    }).catch(error => {
      dispatch({ type: SUGGESTIONS_V2_FETCH_FAIL, error, skipLoading: true, skipAlert: true });
    });
  };
}
