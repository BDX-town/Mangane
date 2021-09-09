import api, { getLinks } from '../api';
import { importFetchedStatuses } from './importer';
import { isLoggedIn } from 'soapbox/utils/auth';

export const FAVOURITED_STATUSES_FETCH_REQUEST = 'FAVOURITED_STATUSES_FETCH_REQUEST';
export const FAVOURITED_STATUSES_FETCH_SUCCESS = 'FAVOURITED_STATUSES_FETCH_SUCCESS';
export const FAVOURITED_STATUSES_FETCH_FAIL    = 'FAVOURITED_STATUSES_FETCH_FAIL';

export const FAVOURITED_STATUSES_EXPAND_REQUEST = 'FAVOURITED_STATUSES_EXPAND_REQUEST';
export const FAVOURITED_STATUSES_EXPAND_SUCCESS = 'FAVOURITED_STATUSES_EXPAND_SUCCESS';
export const FAVOURITED_STATUSES_EXPAND_FAIL    = 'FAVOURITED_STATUSES_EXPAND_FAIL';

export const USER_FAVOURITED_STATUSES_FETCH_REQUEST = 'USER_FAVOURITED_STATUSES_FETCH_REQUEST';
export const USER_FAVOURITED_STATUSES_FETCH_SUCCESS = 'USER_FAVOURITED_STATUSES_FETCH_SUCCESS';
export const USER_FAVOURITED_STATUSES_FETCH_FAIL    = 'USER_FAVOURITED_STATUSES_FETCH_FAIL';

export const USER_FAVOURITED_STATUSES_EXPAND_REQUEST = 'USER_FAVOURITED_STATUSES_EXPAND_REQUEST';
export const USER_FAVOURITED_STATUSES_EXPAND_SUCCESS = 'USER_FAVOURITED_STATUSES_EXPAND_SUCCESS';
export const USER_FAVOURITED_STATUSES_EXPAND_FAIL    = 'USER_FAVOURITED_STATUSES_EXPAND_FAIL';

export function fetchFavouritedStatuses() {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    if (getState().getIn(['status_lists', 'favourites', 'isLoading'])) {
      return;
    }

    dispatch(fetchFavouritedStatusesRequest());

    api(getState).get('/api/v1/favourites').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(fetchFavouritedStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchFavouritedStatusesFail(error));
    });
  };
}

export function fetchFavouritedStatusesRequest() {
  return {
    type: FAVOURITED_STATUSES_FETCH_REQUEST,
    skipLoading: true,
  };
}

export function fetchFavouritedStatusesSuccess(statuses, next) {
  return {
    type: FAVOURITED_STATUSES_FETCH_SUCCESS,
    statuses,
    next,
    skipLoading: true,
  };
}

export function fetchFavouritedStatusesFail(error) {
  return {
    type: FAVOURITED_STATUSES_FETCH_FAIL,
    error,
    skipLoading: true,
  };
}

export function expandFavouritedStatuses() {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().getIn(['status_lists', 'favourites', 'next'], null);

    if (url === null || getState().getIn(['status_lists', 'favourites', 'isLoading'])) {
      return;
    }

    dispatch(expandFavouritedStatusesRequest());

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(expandFavouritedStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandFavouritedStatusesFail(error));
    });
  };
}

export function expandFavouritedStatusesRequest() {
  return {
    type: FAVOURITED_STATUSES_EXPAND_REQUEST,
  };
}

export function expandFavouritedStatusesSuccess(statuses, next) {
  return {
    type: FAVOURITED_STATUSES_EXPAND_SUCCESS,
    statuses,
    next,
  };
}

export function expandFavouritedStatusesFail(error) {
  return {
    type: FAVOURITED_STATUSES_EXPAND_FAIL,
    error,
  };
}

export function fetchUserFavouritedStatuses(accountId) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    if (getState().getIn(['status_lists', `favourites:${accountId}`, 'isLoading'])) {
      return;
    }

    dispatch(fetchUserFavouritedStatusesRequest(accountId));

    api(getState).get(`/api/v1/pleroma/accounts/${accountId}/favourites`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(fetchUserFavouritedStatusesSuccess(accountId, response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchUserFavouritedStatusesFail(accountId, error));
    });
  };
}

export function fetchUserFavouritedStatusesRequest(accountId) {
  return {
    type: USER_FAVOURITED_STATUSES_FETCH_REQUEST,
    accountId,
    skipLoading: true,
  };
}

export function fetchUserFavouritedStatusesSuccess(accountId, statuses, next) {
  return {
    type: USER_FAVOURITED_STATUSES_FETCH_SUCCESS,
    accountId,
    statuses,
    next,
    skipLoading: true,
  };
}

export function fetchUserFavouritedStatusesFail(accountId, error) {
  return {
    type: USER_FAVOURITED_STATUSES_FETCH_FAIL,
    accountId,
    error,
    skipLoading: true,
  };
}

export function expandUserFavouritedStatuses(accountId) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().getIn(['status_lists', `favourites:${accountId}`, 'next'], null);

    if (url === null || getState().getIn(['status_lists', `favourites:${accountId}`, 'isLoading'])) {
      return;
    }

    dispatch(expandUserFavouritedStatusesRequest(accountId));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(expandUserFavouritedStatusesSuccess(accountId, response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandUserFavouritedStatusesFail(accountId, error));
    });
  };
}

export function expandUserFavouritedStatusesRequest(accountId) {
  return {
    type: USER_FAVOURITED_STATUSES_EXPAND_REQUEST,
    accountId,
  };
}

export function expandUserFavouritedStatusesSuccess(accountId, statuses, next) {
  return {
    type: USER_FAVOURITED_STATUSES_EXPAND_SUCCESS,
    accountId,
    statuses,
    next,
  };
}

export function expandUserFavouritedStatusesFail(accountId, error) {
  return {
    type: USER_FAVOURITED_STATUSES_EXPAND_FAIL,
    accountId,
    error,
  };
}
