import api from '../api';
import { importFetchedAccounts } from './importer';
import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';

export const SUGGESTIONS_FETCH_REQUEST = 'SUGGESTIONS_FETCH_REQUEST';
export const SUGGESTIONS_FETCH_SUCCESS = 'SUGGESTIONS_FETCH_SUCCESS';
export const SUGGESTIONS_FETCH_FAIL    = 'SUGGESTIONS_FETCH_FAIL';

export const SUGGESTIONS_DISMISS = 'SUGGESTIONS_DISMISS';

export const SUGGESTIONS_V2_FETCH_REQUEST = 'SUGGESTIONS_V2_FETCH_REQUEST';
export const SUGGESTIONS_V2_FETCH_SUCCESS = 'SUGGESTIONS_V2_FETCH_SUCCESS';
export const SUGGESTIONS_V2_FETCH_FAIL    = 'SUGGESTIONS_V2_FETCH_FAIL';

export function fetchSuggestionsV1() {
  return (dispatch, getState) => {
    dispatch({ type: SUGGESTIONS_FETCH_REQUEST, skipLoading: true });
    api(getState).get('/api/v1/suggestions').then(({ data: accounts }) => {
      dispatch(importFetchedAccounts(accounts));
      dispatch({ type: SUGGESTIONS_FETCH_SUCCESS, accounts, skipLoading: true });
    }).catch(error => {
      dispatch({ type: SUGGESTIONS_FETCH_FAIL, error, skipLoading: true, skipAlert: true });
    });
  };
}

export function fetchSuggestionsV2() {
  return (dispatch, getState) => {
    dispatch({ type: SUGGESTIONS_V2_FETCH_REQUEST, skipLoading: true });
    api(getState).get('/api/v2/suggestions').then(({ data: suggestions }) => {
      const accounts = suggestions.map(({ account }) => account);
      dispatch(importFetchedAccounts(accounts));
      dispatch({ type: SUGGESTIONS_V2_FETCH_SUCCESS, suggestions, skipLoading: true });
    }).catch(error => {
      dispatch({ type: SUGGESTIONS_V2_FETCH_FAIL, error, skipLoading: true, skipAlert: true });
    });
  };
}

export function fetchSuggestions() {
  return (dispatch, getState) => {
    const state = getState();
    const instance = state.get('instance');
    const features = getFeatures(instance);

    if (features.suggestionsV2) {
      dispatch(fetchSuggestionsV2());
    } else if (features.suggestions) {
      dispatch(fetchSuggestionsV1());
    } else {
      // Do nothing
    }
  };
}

export const dismissSuggestion = accountId => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;

  dispatch({
    type: SUGGESTIONS_DISMISS,
    id: accountId,
  });

  api(getState).delete(`/api/v1/suggestions/${accountId}`);
};
