import api, { getLinks } from '../api';

import { importFetchedStatuses } from './importer';

import type { AxiosError } from 'axios';
import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity } from 'soapbox/types/entities';

const BOOKMARKED_STATUSES_FETCH_REQUEST = 'BOOKMARKED_STATUSES_FETCH_REQUEST';
const BOOKMARKED_STATUSES_FETCH_SUCCESS = 'BOOKMARKED_STATUSES_FETCH_SUCCESS';
const BOOKMARKED_STATUSES_FETCH_FAIL    = 'BOOKMARKED_STATUSES_FETCH_FAIL';

const BOOKMARKED_STATUSES_EXPAND_REQUEST = 'BOOKMARKED_STATUSES_EXPAND_REQUEST';
const BOOKMARKED_STATUSES_EXPAND_SUCCESS = 'BOOKMARKED_STATUSES_EXPAND_SUCCESS';
const BOOKMARKED_STATUSES_EXPAND_FAIL    = 'BOOKMARKED_STATUSES_EXPAND_FAIL';

const noOp = () => new Promise(f => f(undefined));

const fetchBookmarkedStatuses = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().status_lists.get('bookmarks')?.isLoading) {
      return dispatch(noOp);
    }

    dispatch(fetchBookmarkedStatusesRequest());

    return api(getState).get('/api/v1/bookmarks').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      return dispatch(fetchBookmarkedStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchBookmarkedStatusesFail(error));
    });
  };

const fetchBookmarkedStatusesRequest = () => ({
  type: BOOKMARKED_STATUSES_FETCH_REQUEST,
});

const fetchBookmarkedStatusesSuccess = (statuses: APIEntity[], next: string | null) => ({
  type: BOOKMARKED_STATUSES_FETCH_SUCCESS,
  statuses,
  next,
});

const fetchBookmarkedStatusesFail = (error: AxiosError) => ({
  type: BOOKMARKED_STATUSES_FETCH_FAIL,
  error,
});

const expandBookmarkedStatuses = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const url = getState().status_lists.get('bookmarks')?.next || null;

    if (url === null || getState().status_lists.get('bookmarks')?.isLoading) {
      return dispatch(noOp);
    }

    dispatch(expandBookmarkedStatusesRequest());

    return api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      return dispatch(expandBookmarkedStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandBookmarkedStatusesFail(error));
    });
  };

const expandBookmarkedStatusesRequest = () => ({
  type: BOOKMARKED_STATUSES_EXPAND_REQUEST,
});

const expandBookmarkedStatusesSuccess = (statuses: APIEntity[], next: string | null) => ({
  type: BOOKMARKED_STATUSES_EXPAND_SUCCESS,
  statuses,
  next,
});

const expandBookmarkedStatusesFail = (error: AxiosError) => ({
  type: BOOKMARKED_STATUSES_EXPAND_FAIL,
  error,
});

export {
  BOOKMARKED_STATUSES_FETCH_REQUEST,
  BOOKMARKED_STATUSES_FETCH_SUCCESS,
  BOOKMARKED_STATUSES_FETCH_FAIL,
  BOOKMARKED_STATUSES_EXPAND_REQUEST,
  BOOKMARKED_STATUSES_EXPAND_SUCCESS,
  BOOKMARKED_STATUSES_EXPAND_FAIL,
  fetchBookmarkedStatuses,
  fetchBookmarkedStatusesRequest,
  fetchBookmarkedStatusesSuccess,
  fetchBookmarkedStatusesFail,
  expandBookmarkedStatuses,
  expandBookmarkedStatusesRequest,
  expandBookmarkedStatusesSuccess,
  expandBookmarkedStatusesFail,
};
