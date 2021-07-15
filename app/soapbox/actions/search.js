import api from '../api';
import { fetchRelationships } from './accounts';
import { importFetchedStatuses } from './importer';

export const SEARCH_CHANGE = 'SEARCH_CHANGE';
export const SEARCH_CLEAR  = 'SEARCH_CLEAR';
export const SEARCH_SHOW   = 'SEARCH_SHOW';

export const SEARCH_FETCH_REQUEST = 'SEARCH_FETCH_REQUEST';
export const SEARCH_FETCH_SUCCESS = 'SEARCH_FETCH_SUCCESS';
export const SEARCH_FETCH_FAIL    = 'SEARCH_FETCH_FAIL';

export function changeSearch(value) {
  return {
    type: SEARCH_CHANGE,
    value,
  };
};

export function clearSearch() {
  return {
    type: SEARCH_CLEAR,
  };
};

export function submitSearch() {
  return (dispatch, getState) => {
    const value = getState().getIn(['search', 'value']);

    if (value.length === 0) {
      return;
    }

    dispatch(fetchSearchRequest());

    api(getState).get('/api/v2/search', {
      params: {
        q: value,
        resolve: true,
        limit: 20,
      },
    }).then(response => {
      if (response.data.statuses) {
        dispatch(importFetchedStatuses(response.data.statuses));
      }

      dispatch(fetchSearchSuccess(response.data));
      dispatch(fetchRelationships(response.data.accounts.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchSearchFail(error));
    });
  };
};

export function fetchSearchRequest() {
  return {
    type: SEARCH_FETCH_REQUEST,
  };
};

export function fetchSearchSuccess(results) {
  return {
    type: SEARCH_FETCH_SUCCESS,
    results,
  };
};

export function fetchSearchFail(error) {
  return {
    type: SEARCH_FETCH_FAIL,
    error,
  };
};

export function showSearch() {
  return {
    type: SEARCH_SHOW,
  };
};
