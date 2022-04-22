import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';

import api from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts } from './importer';

export const SUGGESTIONS_FETCH_REQUEST = 'SUGGESTIONS_FETCH_REQUEST';
export const SUGGESTIONS_FETCH_SUCCESS = 'SUGGESTIONS_FETCH_SUCCESS';
export const SUGGESTIONS_FETCH_FAIL    = 'SUGGESTIONS_FETCH_FAIL';

export const SUGGESTIONS_DISMISS = 'SUGGESTIONS_DISMISS';

export const SUGGESTIONS_V2_FETCH_REQUEST = 'SUGGESTIONS_V2_FETCH_REQUEST';
export const SUGGESTIONS_V2_FETCH_SUCCESS = 'SUGGESTIONS_V2_FETCH_SUCCESS';
export const SUGGESTIONS_V2_FETCH_FAIL    = 'SUGGESTIONS_V2_FETCH_FAIL';

export function fetchSuggestionsV1(params = {}) {
  return (dispatch, getState) => {
    dispatch({ type: SUGGESTIONS_FETCH_REQUEST, skipLoading: true });
    return api(getState).get('/api/v1/suggestions', { params }).then(({ data: accounts }) => {
      dispatch(importFetchedAccounts(accounts));
      dispatch({ type: SUGGESTIONS_FETCH_SUCCESS, accounts, skipLoading: true });
      return accounts;
    }).catch(error => {
      dispatch({ type: SUGGESTIONS_FETCH_FAIL, error, skipLoading: true, skipAlert: true });
      throw error;
    });
  };
}

export function fetchSuggestionsV2(params = {}) {
  return (dispatch, getState) => {
    dispatch({ type: SUGGESTIONS_V2_FETCH_REQUEST, skipLoading: true });
    return api(getState).get('/api/v2/suggestions', { params }).then(({ data: suggestions }) => {
      const accounts = suggestions.map(({ account }) => account);
      dispatch(importFetchedAccounts(accounts));
      dispatch({ type: SUGGESTIONS_V2_FETCH_SUCCESS, suggestions, skipLoading: true });
      return suggestions;
    }).catch(error => {
      dispatch({ type: SUGGESTIONS_V2_FETCH_FAIL, error, skipLoading: true, skipAlert: true });
      throw error;
    });
  };
}

export function fetchSuggestions(params = { limit: 50 }) {
  return (dispatch, getState) => {
    const state = getState();
    const instance = state.get('instance');
    const features = getFeatures(instance);

    if (features.suggestionsV2) {
      dispatch(fetchSuggestionsV2(params))
        .then(suggestions => {
          const accountIds = suggestions.map(({ account }) => account.id);
          dispatch(fetchRelationships(accountIds));
        })
        .catch(() => {});
    } else if (features.suggestions) {
      dispatch(fetchSuggestionsV1(params))
        .then(accounts => {
          const accountIds = accounts.map(({ id }) => id);
          dispatch(fetchRelationships(accountIds));
        })
        .catch(() => {});
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
