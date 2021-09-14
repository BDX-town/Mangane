import api, { getLinks } from '../api';
import { importFetchedStatuses } from './importer';
import { isLoggedIn } from 'soapbox/utils/auth';

export const FAVOURITED_STATUSES_FETCH_REQUEST = 'FAVOURITED_STATUSES_FETCH_REQUEST';
export const FAVOURITED_STATUSES_FETCH_SUCCESS = 'FAVOURITED_STATUSES_FETCH_SUCCESS';
export const FAVOURITED_STATUSES_FETCH_FAIL    = 'FAVOURITED_STATUSES_FETCH_FAIL';

export const FAVOURITED_STATUSES_EXPAND_REQUEST = 'FAVOURITED_STATUSES_EXPAND_REQUEST';
export const FAVOURITED_STATUSES_EXPAND_SUCCESS = 'FAVOURITED_STATUSES_EXPAND_SUCCESS';
export const FAVOURITED_STATUSES_EXPAND_FAIL    = 'FAVOURITED_STATUSES_EXPAND_FAIL';

export const ACCOUNT_FAVOURITED_STATUSES_FETCH_REQUEST = 'ACCOUNT_FAVOURITED_STATUSES_FETCH_REQUEST';
export const ACCOUNT_FAVOURITED_STATUSES_FETCH_SUCCESS = 'ACCOUNT_FAVOURITED_STATUSES_FETCH_SUCCESS';
export const ACCOUNT_FAVOURITED_STATUSES_FETCH_FAIL    = 'ACCOUNT_FAVOURITED_STATUSES_FETCH_FAIL';

export const ACCOUNT_FAVOURITED_STATUSES_EXPAND_REQUEST = 'ACCOUNT_FAVOURITED_STATUSES_EXPAND_REQUEST';
export const ACCOUNT_FAVOURITED_STATUSES_EXPAND_SUCCESS = 'ACCOUNT_FAVOURITED_STATUSES_EXPAND_SUCCESS';
export const ACCOUNT_FAVOURITED_STATUSES_EXPAND_FAIL    = 'ACCOUNT_FAVOURITED_STATUSES_EXPAND_FAIL';

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

export function fetchAccountFavouritedStatuses(accountId) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    if (getState().getIn(['status_lists', `favourites:${accountId}`, 'isLoading'])) {
      return;
    }

    dispatch(fetchAccountFavouritedStatusesRequest(accountId));

    api(getState).get(`/api/v1/pleroma/accounts/${accountId}/favourites`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(fetchAccountFavouritedStatusesSuccess(accountId, response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchAccountFavouritedStatusesFail(accountId, error));
    });
  };
}

export function fetchAccountFavouritedStatusesRequest(accountId) {
  return {
    type: ACCOUNT_FAVOURITED_STATUSES_FETCH_REQUEST,
    accountId,
    skipLoading: true,
  };
}

export function fetchAccountFavouritedStatusesSuccess(accountId, statuses, next) {
  return {
    type: ACCOUNT_FAVOURITED_STATUSES_FETCH_SUCCESS,
    accountId,
    statuses,
    next,
    skipLoading: true,
  };
}

export function fetchAccountFavouritedStatusesFail(accountId, error) {
  return {
    type: ACCOUNT_FAVOURITED_STATUSES_FETCH_FAIL,
    accountId,
    error,
    skipLoading: true,
  };
}

export function expandAccountFavouritedStatuses(accountId) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().getIn(['status_lists', `favourites:${accountId}`, 'next'], null);

    if (url === null || getState().getIn(['status_lists', `favourites:${accountId}`, 'isLoading'])) {
      return;
    }

    dispatch(expandAccountFavouritedStatusesRequest(accountId));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(expandAccountFavouritedStatusesSuccess(accountId, response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandAccountFavouritedStatusesFail(accountId, error));
    });
  };
}

export function expandAccountFavouritedStatusesRequest(accountId) {
  return {
    type: ACCOUNT_FAVOURITED_STATUSES_EXPAND_REQUEST,
    accountId,
  };
}

export function expandAccountFavouritedStatusesSuccess(accountId, statuses, next) {
  return {
    type: ACCOUNT_FAVOURITED_STATUSES_EXPAND_SUCCESS,
    accountId,
    statuses,
    next,
  };
}

export function expandAccountFavouritedStatusesFail(accountId, error) {
  return {
    type: ACCOUNT_FAVOURITED_STATUSES_EXPAND_FAIL,
    accountId,
    error,
  };
}
