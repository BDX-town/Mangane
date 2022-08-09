import api from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts, importFetchedStatuses } from './importer';

import type { AxiosError } from 'axios';
import type { SearchFilter } from 'soapbox/reducers/search';
import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity } from 'soapbox/types/entities';

const SEARCH_CHANGE = 'SEARCH_CHANGE';
const SEARCH_CLEAR  = 'SEARCH_CLEAR';
const SEARCH_SHOW   = 'SEARCH_SHOW';

const SEARCH_FETCH_REQUEST = 'SEARCH_FETCH_REQUEST';
const SEARCH_FETCH_SUCCESS = 'SEARCH_FETCH_SUCCESS';
const SEARCH_FETCH_FAIL    = 'SEARCH_FETCH_FAIL';

const SEARCH_FILTER_SET = 'SEARCH_FILTER_SET';

const SEARCH_EXPAND_REQUEST = 'SEARCH_EXPAND_REQUEST';
const SEARCH_EXPAND_SUCCESS = 'SEARCH_EXPAND_SUCCESS';
const SEARCH_EXPAND_FAIL    = 'SEARCH_EXPAND_FAIL';

const SEARCH_ACCOUNT_SET = 'SEARCH_ACCOUNT_SET';

const changeSearch = (value: string) =>
  (dispatch: AppDispatch) => {
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

const clearSearch = () => ({
  type: SEARCH_CLEAR,
});

const submitSearch = (filter?: SearchFilter) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const value = getState().search.value;
    const type = filter || getState().search.filter || 'accounts';
    const accountId = getState().search.accountId;

    // An empty search doesn't return any results
    if (value.length === 0) {
      return;
    }

    dispatch(fetchSearchRequest(value));

    const params: Record<string, any> = {
      q: value,
      resolve: true,
      limit: 20,
      type,
    };

    if (accountId) params.account_id = accountId;

    api(getState).get('/api/v2/search', {
      params,
    }).then(response => {
      if (response.data.accounts) {
        dispatch(importFetchedAccounts(response.data.accounts));
      }

      if (response.data.statuses) {
        dispatch(importFetchedStatuses(response.data.statuses));
      }

      dispatch(fetchSearchSuccess(response.data, value, type));
      dispatch(fetchRelationships(response.data.accounts.map((item: APIEntity) => item.id)));
    }).catch(error => {
      dispatch(fetchSearchFail(error));
    });
  };

const fetchSearchRequest = (value: string) => ({
  type: SEARCH_FETCH_REQUEST,
  value,
});

const fetchSearchSuccess = (results: APIEntity[], searchTerm: string, searchType: SearchFilter) => ({
  type: SEARCH_FETCH_SUCCESS,
  results,
  searchTerm,
  searchType,
});

const fetchSearchFail = (error: AxiosError) => ({
  type: SEARCH_FETCH_FAIL,
  error,
});

const setFilter = (filterType: SearchFilter) =>
  (dispatch: AppDispatch) => {
    dispatch(submitSearch(filterType));

    dispatch({
      type: SEARCH_FILTER_SET,
      path: ['search', 'filter'],
      value: filterType,
    });
  };

const expandSearch = (type: SearchFilter) => (dispatch: AppDispatch, getState: () => RootState) => {
  const value  = getState().search.value;
  const offset = getState().search.results[type].size;

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
    dispatch(fetchRelationships(data.accounts.map((item: APIEntity) => item.id)));
  }).catch(error => {
    dispatch(expandSearchFail(error));
  });
};

const expandSearchRequest = (searchType: SearchFilter) => ({
  type: SEARCH_EXPAND_REQUEST,
  searchType,
});

const expandSearchSuccess = (results: APIEntity[], searchTerm: string, searchType: SearchFilter) => ({
  type: SEARCH_EXPAND_SUCCESS,
  results,
  searchTerm,
  searchType,
});

const expandSearchFail = (error: AxiosError) => ({
  type: SEARCH_EXPAND_FAIL,
  error,
});

const showSearch = () => ({
  type: SEARCH_SHOW,
});

const setSearchAccount = (accountId: string | null) => ({
  type: SEARCH_ACCOUNT_SET,
  accountId,
});

export {
  SEARCH_CHANGE,
  SEARCH_CLEAR,
  SEARCH_SHOW,
  SEARCH_FETCH_REQUEST,
  SEARCH_FETCH_SUCCESS,
  SEARCH_FETCH_FAIL,
  SEARCH_FILTER_SET,
  SEARCH_EXPAND_REQUEST,
  SEARCH_EXPAND_SUCCESS,
  SEARCH_EXPAND_FAIL,
  SEARCH_ACCOUNT_SET,
  changeSearch,
  clearSearch,
  submitSearch,
  fetchSearchRequest,
  fetchSearchSuccess,
  fetchSearchFail,
  setFilter,
  expandSearch,
  expandSearchRequest,
  expandSearchSuccess,
  expandSearchFail,
  showSearch,
  setSearchAccount,
};
