import { defineMessages } from 'react-intl';

import snackbar from 'soapbox/actions/snackbar';
import { isLoggedIn } from 'soapbox/utils/auth';

import api from '../api';

import { importFetchedAccounts, importFetchedStatus } from './importer';

export const REBLOG_REQUEST = 'REBLOG_REQUEST';
export const REBLOG_SUCCESS = 'REBLOG_SUCCESS';
export const REBLOG_FAIL    = 'REBLOG_FAIL';

export const FAVOURITE_REQUEST = 'FAVOURITE_REQUEST';
export const FAVOURITE_SUCCESS = 'FAVOURITE_SUCCESS';
export const FAVOURITE_FAIL    = 'FAVOURITE_FAIL';

export const UNREBLOG_REQUEST = 'UNREBLOG_REQUEST';
export const UNREBLOG_SUCCESS = 'UNREBLOG_SUCCESS';
export const UNREBLOG_FAIL    = 'UNREBLOG_FAIL';

export const UNFAVOURITE_REQUEST = 'UNFAVOURITE_REQUEST';
export const UNFAVOURITE_SUCCESS = 'UNFAVOURITE_SUCCESS';
export const UNFAVOURITE_FAIL    = 'UNFAVOURITE_FAIL';

export const REBLOGS_FETCH_REQUEST = 'REBLOGS_FETCH_REQUEST';
export const REBLOGS_FETCH_SUCCESS = 'REBLOGS_FETCH_SUCCESS';
export const REBLOGS_FETCH_FAIL    = 'REBLOGS_FETCH_FAIL';

export const FAVOURITES_FETCH_REQUEST = 'FAVOURITES_FETCH_REQUEST';
export const FAVOURITES_FETCH_SUCCESS = 'FAVOURITES_FETCH_SUCCESS';
export const FAVOURITES_FETCH_FAIL    = 'FAVOURITES_FETCH_FAIL';

export const REACTIONS_FETCH_REQUEST = 'REACTIONS_FETCH_REQUEST';
export const REACTIONS_FETCH_SUCCESS = 'REACTIONS_FETCH_SUCCESS';
export const REACTIONS_FETCH_FAIL    = 'REACTIONS_FETCH_FAIL';

export const PIN_REQUEST = 'PIN_REQUEST';
export const PIN_SUCCESS = 'PIN_SUCCESS';
export const PIN_FAIL    = 'PIN_FAIL';

export const UNPIN_REQUEST = 'UNPIN_REQUEST';
export const UNPIN_SUCCESS = 'UNPIN_SUCCESS';
export const UNPIN_FAIL    = 'UNPIN_FAIL';

export const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST';
export const BOOKMARK_SUCCESS = 'BOOKMARKED_SUCCESS';
export const BOOKMARK_FAIL    = 'BOOKMARKED_FAIL';

export const UNBOOKMARK_REQUEST = 'UNBOOKMARKED_REQUEST';
export const UNBOOKMARK_SUCCESS = 'UNBOOKMARKED_SUCCESS';
export const UNBOOKMARK_FAIL    = 'UNBOOKMARKED_FAIL';

export const REMOTE_INTERACTION_REQUEST = 'REMOTE_INTERACTION_REQUEST';
export const REMOTE_INTERACTION_SUCCESS = 'REMOTE_INTERACTION_SUCCESS';
export const REMOTE_INTERACTION_FAIL    = 'REMOTE_INTERACTION_FAIL';

const messages = defineMessages({
  bookmarkAdded: { id: 'status.bookmarked', defaultMessage: 'Bookmark added.' },
  bookmarkRemoved: { id: 'status.unbookmarked', defaultMessage: 'Bookmark removed.' },
  view: { id: 'snackbar.view', defaultMessage: 'View' },
});

export function reblog(status) {
  return function(dispatch, getState) {
    if (!isLoggedIn(getState)) return;

    dispatch(reblogRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/reblog`).then(function(response) {
      // The reblog API method returns a new status wrapped around the original. In this case we are only
      // interested in how the original is modified, hence passing it skipping the wrapper
      dispatch(importFetchedStatus(response.data.reblog));
      dispatch(reblogSuccess(status));
    }).catch(function(error) {
      dispatch(reblogFail(status, error));
    });
  };
}

export function unreblog(status) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unreblogRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unreblog`).then(response => {
      dispatch(unreblogSuccess(status));
    }).catch(error => {
      dispatch(unreblogFail(status, error));
    });
  };
}

export function reblogRequest(status) {
  return {
    type: REBLOG_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function reblogSuccess(status) {
  return {
    type: REBLOG_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function reblogFail(status, error) {
  return {
    type: REBLOG_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unreblogRequest(status) {
  return {
    type: UNREBLOG_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function unreblogSuccess(status) {
  return {
    type: UNREBLOG_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unreblogFail(status, error) {
  return {
    type: UNREBLOG_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function favourite(status) {
  return function(dispatch, getState) {
    if (!isLoggedIn(getState)) return;

    dispatch(favouriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/favourite`).then(function(response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(favouriteSuccess(status));
    }).catch(function(error) {
      dispatch(favouriteFail(status, error));
    });
  };
}

export function unfavourite(status) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unfavouriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unfavourite`).then(response => {
      dispatch(unfavouriteSuccess(status));
    }).catch(error => {
      dispatch(unfavouriteFail(status, error));
    });
  };
}

export function favouriteRequest(status) {
  return {
    type: FAVOURITE_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function favouriteSuccess(status) {
  return {
    type: FAVOURITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function favouriteFail(status, error) {
  return {
    type: FAVOURITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unfavouriteRequest(status) {
  return {
    type: UNFAVOURITE_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function unfavouriteSuccess(status) {
  return {
    type: UNFAVOURITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unfavouriteFail(status, error) {
  return {
    type: UNFAVOURITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function bookmark(status) {
  return function(dispatch, getState) {
    dispatch(bookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then(function(response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(bookmarkSuccess(status, response.data));
      dispatch(snackbar.success(messages.bookmarkAdded, messages.view, '/bookmarks'));
    }).catch(function(error) {
      dispatch(bookmarkFail(status, error));
    });
  };
}

export function unbookmark(status) {
  return (dispatch, getState) => {
    dispatch(unbookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unbookmark`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unbookmarkSuccess(status, response.data));
      dispatch(snackbar.success(messages.bookmarkRemoved));
    }).catch(error => {
      dispatch(unbookmarkFail(status, error));
    });
  };
}

export function bookmarkRequest(status) {
  return {
    type: BOOKMARK_REQUEST,
    status: status,
  };
}

export function bookmarkSuccess(status, response) {
  return {
    type: BOOKMARK_SUCCESS,
    status: status,
    response: response,
  };
}

export function bookmarkFail(status, error) {
  return {
    type: BOOKMARK_FAIL,
    status: status,
    error: error,
  };
}

export function unbookmarkRequest(status) {
  return {
    type: UNBOOKMARK_REQUEST,
    status: status,
  };
}

export function unbookmarkSuccess(status, response) {
  return {
    type: UNBOOKMARK_SUCCESS,
    status: status,
    response: response,
  };
}

export function unbookmarkFail(status, error) {
  return {
    type: UNBOOKMARK_FAIL,
    status: status,
    error: error,
  };
}

export function fetchReblogs(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchReblogsRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/reblogged_by`).then(response => {
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchReblogsSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchReblogsFail(id, error));
    });
  };
}

export function fetchReblogsRequest(id) {
  return {
    type: REBLOGS_FETCH_REQUEST,
    id,
  };
}

export function fetchReblogsSuccess(id, accounts) {
  return {
    type: REBLOGS_FETCH_SUCCESS,
    id,
    accounts,
  };
}

export function fetchReblogsFail(id, error) {
  return {
    type: REBLOGS_FETCH_FAIL,
    error,
  };
}

export function fetchFavourites(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchFavouritesRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/favourited_by`).then(response => {
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchFavouritesSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchFavouritesFail(id, error));
    });
  };
}

export function fetchFavouritesRequest(id) {
  return {
    type: FAVOURITES_FETCH_REQUEST,
    id,
  };
}

export function fetchFavouritesSuccess(id, accounts) {
  return {
    type: FAVOURITES_FETCH_SUCCESS,
    id,
    accounts,
  };
}

export function fetchFavouritesFail(id, error) {
  return {
    type: FAVOURITES_FETCH_FAIL,
    error,
  };
}

export function fetchReactions(id) {
  return (dispatch, getState) => {
    dispatch(fetchReactionsRequest(id));

    api(getState).get(`/api/v1/pleroma/statuses/${id}/reactions`).then(response => {
      dispatch(importFetchedAccounts(response.data.map(({ accounts }) => accounts).flat()));
      dispatch(fetchReactionsSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchReactionsFail(id, error));
    });
  };
}

export function fetchReactionsRequest(id) {
  return {
    type: REACTIONS_FETCH_REQUEST,
    id,
  };
}

export function fetchReactionsSuccess(id, reactions) {
  return {
    type: REACTIONS_FETCH_SUCCESS,
    id,
    reactions,
  };
}

export function fetchReactionsFail(id, error) {
  return {
    type: REACTIONS_FETCH_FAIL,
    error,
  };
}

export function pin(status) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(pinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/pin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(pinSuccess(status));
    }).catch(error => {
      dispatch(pinFail(status, error));
    });
  };
}

export function pinRequest(status) {
  return {
    type: PIN_REQUEST,
    status,
    skipLoading: true,
  };
}

export function pinSuccess(status) {
  return {
    type: PIN_SUCCESS,
    status,
    skipLoading: true,
  };
}

export function pinFail(status, error) {
  return {
    type: PIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
}

export function unpin(status) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unpinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unpin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unpinSuccess(status));
    }).catch(error => {
      dispatch(unpinFail(status, error));
    });
  };
}

export function unpinRequest(status) {
  return {
    type: UNPIN_REQUEST,
    status,
    skipLoading: true,
  };
}

export function unpinSuccess(status) {
  return {
    type: UNPIN_SUCCESS,
    status,
    skipLoading: true,
  };
}

export function unpinFail(status, error) {
  return {
    type: UNPIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
}

export function remoteInteraction(ap_id, profile) {
  return (dispatch, getState) => {
    dispatch(remoteInteractionRequest(ap_id, profile));

    return api(getState).post('/api/v1/pleroma/remote_interaction', { ap_id, profile }).then(({ data }) => {
      if (data.error) throw new Error(data.error);

      dispatch(remoteInteractionSuccess(ap_id, profile, data.url));

      return data.url;
    }).catch(error => {
      dispatch(remoteInteractionFail(ap_id, profile, error));
      throw error;
    });
  };
}

export function remoteInteractionRequest(ap_id, profile) {
  return {
    type: REMOTE_INTERACTION_REQUEST,
    ap_id,
    profile,
  };
}

export function remoteInteractionSuccess(ap_id, profile, url) {
  return {
    type: REMOTE_INTERACTION_SUCCESS,
    ap_id,
    profile,
    url,
  };
}

export function remoteInteractionFail(ap_id, profile, error) {
  return {
    type: REMOTE_INTERACTION_FAIL,
    ap_id,
    profile,
    error,
  };
}
