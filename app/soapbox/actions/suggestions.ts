import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';

import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts } from './importer';

import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity } from 'soapbox/types/entities';

const SUGGESTIONS_FETCH_REQUEST = 'SUGGESTIONS_FETCH_REQUEST';
const SUGGESTIONS_FETCH_SUCCESS = 'SUGGESTIONS_FETCH_SUCCESS';
const SUGGESTIONS_FETCH_FAIL = 'SUGGESTIONS_FETCH_FAIL';

const SUGGESTIONS_DISMISS = 'SUGGESTIONS_DISMISS';

const SUGGESTIONS_V2_FETCH_REQUEST = 'SUGGESTIONS_V2_FETCH_REQUEST';
const SUGGESTIONS_V2_FETCH_SUCCESS = 'SUGGESTIONS_V2_FETCH_SUCCESS';
const SUGGESTIONS_V2_FETCH_FAIL = 'SUGGESTIONS_V2_FETCH_FAIL';

const fetchSuggestionsV1 = (params: Record<string, any> = {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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

const fetchSuggestionsV2 = (params: Record<string, any> = {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const next = getState().suggestions.next;

    dispatch({ type: SUGGESTIONS_V2_FETCH_REQUEST, skipLoading: true });

    return api(getState).get(next ? next : '/api/v2/suggestions', next ? {} : { params }).then((response) => {
      const suggestions: APIEntity[] = response.data;
      const accounts = suggestions.map(({ account }) => account);
      const next = getLinks(response).refs.find(link => link.rel === 'next')?.uri;

      dispatch(importFetchedAccounts(accounts));
      dispatch({ type: SUGGESTIONS_V2_FETCH_SUCCESS, suggestions, next, skipLoading: true });
      return suggestions;
    }).catch(error => {
      dispatch({ type: SUGGESTIONS_V2_FETCH_FAIL, error, skipLoading: true, skipAlert: true });
      throw error;
    });
  };

const fetchSuggestions = (params: Record<string, any> = { limit: 50 }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const me = state.me;
    const instance = state.instance;
    const features = getFeatures(instance);

    if (!me) return;

    if (features.suggestionsV2) {
      dispatch(fetchSuggestionsV2(params))
        .then((suggestions: APIEntity[]) => {
          const accountIds = suggestions.map(({ account }) => account.id);
          dispatch(fetchRelationships(accountIds));
        })
        .catch(() => { });
    } else if (features.suggestions) {
      dispatch(fetchSuggestionsV1(params))
        .then((accounts: APIEntity[]) => {
          const accountIds = accounts.map(({ id }) => id);
          dispatch(fetchRelationships(accountIds));
        })
        .catch(() => { });
    } else {
      // Do nothing
    }
  };

const dismissSuggestion = (accountId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch({
      type: SUGGESTIONS_DISMISS,
      id: accountId,
    });

    api(getState).delete(`/api/v1/suggestions/${accountId}`);
  };

export {
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_FETCH_SUCCESS,
  SUGGESTIONS_FETCH_FAIL,
  SUGGESTIONS_DISMISS,
  SUGGESTIONS_V2_FETCH_REQUEST,
  SUGGESTIONS_V2_FETCH_SUCCESS,
  SUGGESTIONS_V2_FETCH_FAIL,
  fetchSuggestionsV1,
  fetchSuggestionsV2,
  fetchSuggestions,
  dismissSuggestion,
};
