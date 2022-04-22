import api from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts, importFetchedStatuses } from './importer';

export const SEARCH_CHANGE = 'SEARCH_CHANGE';
export const SEARCH_CLEAR  = 'SEARCH_CLEAR';
export const SEARCH_SHOW   = 'SEARCH_SHOW';

export const SEARCH_FETCH_REQUEST = 'SEARCH_FETCH_REQUEST';
export const SEARCH_FETCH_SUCCESS = 'SEARCH_FETCH_SUCCESS';
export const SEARCH_FETCH_FAIL    = 'SEARCH_FETCH_FAIL';

export const SEARCH_FILTER_SET = 'SEARCH_FILTER_SET';

export const SEARCH_EXPAND_REQUEST = 'SEARCH_EXPAND_REQUEST';
export const SEARCH_EXPAND_SUCCESS = 'SEARCH_EXPAND_SUCCESS';
export const SEARCH_EXPAND_FAIL    = 'SEARCH_EXPAND_FAIL';

export function changeSearch(value) {
  return (dispatch, getState) => {
    // If backspaced all the way, clear the search
    if (value.length === 0) {
      return dispatch(clearSearch());
    } else {
      return dispatch({
        type: SEARCH_CHANGE,
        value,
      });
    }
  };
}

export function clearSearch() {
  return {
    type: SEARCH_CLEAR,
  };
}

export function submitSearch(filter) {
  return (dispatch, getState) => {
    const value = getState().getIn(['search', 'value']);
    const type = filter || getState().getIn(['search', 'filter'], 'accounts');

    // An empty search doesn't return any results
    if (value.length === 0) {
      return;
    }

    dispatch(fetchSearchRequest(value));

    api(getState).get('/api/v2/search', {
      params: {
        q: value,
        resolve: true,
        limit: 20,
        type,
      },
    }).then(response => {
      if (response.data.accounts) {
        dispatch(importFetchedAccounts(response.data.accounts));
      }

      if (response.data.statuses) {
        dispatch(importFetchedStatuses(response.data.statuses));
      }

      dispatch(fetchSearchSuccess(response.data, value, type));
      dispatch(fetchRelationships(response.data.accounts.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchSearchFail(error));
    });
  };
}

export function fetchSearchRequest(value) {
  return {
    type: SEARCH_FETCH_REQUEST,
    value,
  };
}

export function fetchSearchSuccess(results, searchTerm, searchType) {
  return {
    type: SEARCH_FETCH_SUCCESS,
    results,
    searchTerm,
    searchType,
  };
}

export function fetchSearchFail(error) {
  return {
    type: SEARCH_FETCH_FAIL,
    error,
  };
}

export function setFilter(filterType) {
  return (dispatch) => {
    dispatch(submitSearch(filterType));

    dispatch({
      type: SEARCH_FILTER_SET,
      path: ['search', 'filter'],
      value: filterType,
    });
  };
}

export const expandSearch = type => (dispatch, getState) => {
  const value  = getState().getIn(['search', 'value']);
  const offset = getState().getIn(['search', 'results', type]).size;

  dispatch(expandSearchRequest(type));

  api(getState).get('/api/v2/search', {
    params: {
      q: value,
      type,
      offset,
    },
  }).then(({ data }) => {
    if (data.accounts) {
      dispatch(importFetchedAccounts(data.accounts));
    }

    if (data.statuses) {
      dispatch(importFetchedStatuses(data.statuses));
    }

    dispatch(expandSearchSuccess(data, value, type));
    dispatch(fetchRelationships(data.accounts.map(item => item.id)));
  }).catch(error => {
    dispatch(expandSearchFail(error));
  });
};

export const expandSearchRequest = (searchType) => ({
  type: SEARCH_EXPAND_REQUEST,
  searchType,
});

export const expandSearchSuccess = (results, searchTerm, searchType) => ({
  type: SEARCH_EXPAND_SUCCESS,
  results,
  searchTerm,
  searchType,
});

export const expandSearchFail = error => ({
  type: SEARCH_EXPAND_FAIL,
  error,
});

export const showSearch = () => ({
  type: SEARCH_SHOW,
});
