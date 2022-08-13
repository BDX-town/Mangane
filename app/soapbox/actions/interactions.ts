import { defineMessages } from 'react-intl';

import snackbar from 'soapbox/actions/snackbar';
import { isLoggedIn } from 'soapbox/utils/auth';

import api from '../api';

import { importFetchedAccounts, importFetchedStatus } from './importer';

import type { AxiosError } from 'axios';
import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity, Status as StatusEntity } from 'soapbox/types/entities';

const REBLOG_REQUEST = 'REBLOG_REQUEST';
const REBLOG_SUCCESS = 'REBLOG_SUCCESS';
const REBLOG_FAIL    = 'REBLOG_FAIL';

const FAVOURITE_REQUEST = 'FAVOURITE_REQUEST';
const FAVOURITE_SUCCESS = 'FAVOURITE_SUCCESS';
const FAVOURITE_FAIL    = 'FAVOURITE_FAIL';

const UNREBLOG_REQUEST = 'UNREBLOG_REQUEST';
const UNREBLOG_SUCCESS = 'UNREBLOG_SUCCESS';
const UNREBLOG_FAIL    = 'UNREBLOG_FAIL';

const UNFAVOURITE_REQUEST = 'UNFAVOURITE_REQUEST';
const UNFAVOURITE_SUCCESS = 'UNFAVOURITE_SUCCESS';
const UNFAVOURITE_FAIL    = 'UNFAVOURITE_FAIL';

const REBLOGS_FETCH_REQUEST = 'REBLOGS_FETCH_REQUEST';
const REBLOGS_FETCH_SUCCESS = 'REBLOGS_FETCH_SUCCESS';
const REBLOGS_FETCH_FAIL    = 'REBLOGS_FETCH_FAIL';

const FAVOURITES_FETCH_REQUEST = 'FAVOURITES_FETCH_REQUEST';
const FAVOURITES_FETCH_SUCCESS = 'FAVOURITES_FETCH_SUCCESS';
const FAVOURITES_FETCH_FAIL    = 'FAVOURITES_FETCH_FAIL';

const REACTIONS_FETCH_REQUEST = 'REACTIONS_FETCH_REQUEST';
const REACTIONS_FETCH_SUCCESS = 'REACTIONS_FETCH_SUCCESS';
const REACTIONS_FETCH_FAIL    = 'REACTIONS_FETCH_FAIL';

const PIN_REQUEST = 'PIN_REQUEST';
const PIN_SUCCESS = 'PIN_SUCCESS';
const PIN_FAIL    = 'PIN_FAIL';

const UNPIN_REQUEST = 'UNPIN_REQUEST';
const UNPIN_SUCCESS = 'UNPIN_SUCCESS';
const UNPIN_FAIL    = 'UNPIN_FAIL';

const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST';
const BOOKMARK_SUCCESS = 'BOOKMARKED_SUCCESS';
const BOOKMARK_FAIL    = 'BOOKMARKED_FAIL';

const UNBOOKMARK_REQUEST = 'UNBOOKMARKED_REQUEST';
const UNBOOKMARK_SUCCESS = 'UNBOOKMARKED_SUCCESS';
const UNBOOKMARK_FAIL    = 'UNBOOKMARKED_FAIL';

const REMOTE_INTERACTION_REQUEST = 'REMOTE_INTERACTION_REQUEST';
const REMOTE_INTERACTION_SUCCESS = 'REMOTE_INTERACTION_SUCCESS';
const REMOTE_INTERACTION_FAIL    = 'REMOTE_INTERACTION_FAIL';

const messages = defineMessages({
  bookmarkAdded: { id: 'status.bookmarked', defaultMessage: 'Bookmark added.' },
  bookmarkRemoved: { id: 'status.unbookmarked', defaultMessage: 'Bookmark removed.' },
  view: { id: 'snackbar.view', defaultMessage: 'View' },
});

const reblog = (status: StatusEntity) =>
  function(dispatch: AppDispatch, getState: () => RootState) {
    if (!isLoggedIn(getState)) return;

    dispatch(reblogRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/reblog`).then(function(response) {
      // The reblog API method returns a new status wrapped around the original. In this case we are only
      // interested in how the original is modified, hence passing it skipping the wrapper
      dispatch(importFetchedStatus(response.data.reblog));
      dispatch(reblogSuccess(status));
    }).catch(error => {
      dispatch(reblogFail(status, error));
    });
  };

const unreblog = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unreblogRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unreblog`).then(() => {
      dispatch(unreblogSuccess(status));
    }).catch(error => {
      dispatch(unreblogFail(status, error));
    });
  };

const toggleReblog = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (status.reblogged) {
      dispatch(unreblog(status));
    } else {
      dispatch(reblog(status));
    }
  };

const reblogRequest = (status: StatusEntity) => ({
  type: REBLOG_REQUEST,
  status: status,
  skipLoading: true,
});

const reblogSuccess = (status: StatusEntity) => ({
  type: REBLOG_SUCCESS,
  status: status,
  skipLoading: true,
});

const reblogFail = (status: StatusEntity, error: AxiosError) => ({
  type: REBLOG_FAIL,
  status: status,
  error: error,
  skipLoading: true,
});

const unreblogRequest = (status: StatusEntity) => ({
  type: UNREBLOG_REQUEST,
  status: status,
  skipLoading: true,
});

const unreblogSuccess = (status: StatusEntity) => ({
  type: UNREBLOG_SUCCESS,
  status: status,
  skipLoading: true,
});

const unreblogFail = (status: StatusEntity, error: AxiosError) => ({
  type: UNREBLOG_FAIL,
  status: status,
  error: error,
  skipLoading: true,
});

const favourite = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(favouriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/favourite`).then(function(response) {
      dispatch(favouriteSuccess(status));
    }).catch(function(error) {
      dispatch(favouriteFail(status, error));
    });
  };

const unfavourite = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unfavouriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unfavourite`).then(() => {
      dispatch(unfavouriteSuccess(status));
    }).catch(error => {
      dispatch(unfavouriteFail(status, error));
    });
  };

const toggleFavourite = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (status.favourited) {
      dispatch(unfavourite(status));
    } else {
      dispatch(favourite(status));
    }
  };


const favouriteRequest = (status: StatusEntity) => ({
  type: FAVOURITE_REQUEST,
  status: status,
  skipLoading: true,
});

const favouriteSuccess = (status: StatusEntity) => ({
  type: FAVOURITE_SUCCESS,
  status: status,
  skipLoading: true,
});

const favouriteFail = (status: StatusEntity, error: AxiosError) => ({
  type: FAVOURITE_FAIL,
  status: status,
  error: error,
  skipLoading: true,
});

const unfavouriteRequest = (status: StatusEntity) => ({
  type: UNFAVOURITE_REQUEST,
  status: status,
  skipLoading: true,
});

const unfavouriteSuccess = (status: StatusEntity) => ({
  type: UNFAVOURITE_SUCCESS,
  status: status,
  skipLoading: true,
});

const unfavouriteFail = (status: StatusEntity, error: AxiosError) => ({
  type: UNFAVOURITE_FAIL,
  status: status,
  error: error,
  skipLoading: true,
});

const bookmark = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(bookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then(function(response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(bookmarkSuccess(status, response.data));
      dispatch(snackbar.success(messages.bookmarkAdded, messages.view, '/bookmarks'));
    }).catch(function(error) {
      dispatch(bookmarkFail(status, error));
    });
  };

const unbookmark = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(unbookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unbookmark`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unbookmarkSuccess(status, response.data));
      dispatch(snackbar.success(messages.bookmarkRemoved));
    }).catch(error => {
      dispatch(unbookmarkFail(status, error));
    });
  };

const toggleBookmark = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (status.bookmarked) {
      dispatch(unbookmark(status));
    } else {
      dispatch(bookmark(status));
    }
  };

const bookmarkRequest = (status: StatusEntity) => ({
  type: BOOKMARK_REQUEST,
  status: status,
});

const bookmarkSuccess = (status: StatusEntity, response: APIEntity) => ({
  type: BOOKMARK_SUCCESS,
  status: status,
  response: response,
});

const bookmarkFail = (status: StatusEntity, error: AxiosError) => ({
  type: BOOKMARK_FAIL,
  status: status,
  error: error,
});

const unbookmarkRequest = (status: StatusEntity) => ({
  type: UNBOOKMARK_REQUEST,
  status: status,
});

const unbookmarkSuccess = (status: StatusEntity, response: APIEntity) => ({
  type: UNBOOKMARK_SUCCESS,
  status: status,
  response: response,
});

const unbookmarkFail = (status: StatusEntity, error: AxiosError) => ({
  type: UNBOOKMARK_FAIL,
  status: status,
  error,
});

const fetchReblogs = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchReblogsRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/reblogged_by`).then(response => {
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchReblogsSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchReblogsFail(id, error));
    });
  };

const fetchReblogsRequest = (id: string) => ({
  type: REBLOGS_FETCH_REQUEST,
  id,
});

const fetchReblogsSuccess = (id: string, accounts: APIEntity[]) => ({
  type: REBLOGS_FETCH_SUCCESS,
  id,
  accounts,
});

const fetchReblogsFail = (id: string, error: AxiosError) => ({
  type: REBLOGS_FETCH_FAIL,
  id,
  error,
});

const fetchFavourites = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchFavouritesRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/favourited_by`).then(response => {
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchFavouritesSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchFavouritesFail(id, error));
    });
  };

const fetchFavouritesRequest = (id: string) => ({
  type: FAVOURITES_FETCH_REQUEST,
  id,
});

const fetchFavouritesSuccess = (id: string, accounts: APIEntity[]) => ({
  type: FAVOURITES_FETCH_SUCCESS,
  id,
  accounts,
});

const fetchFavouritesFail = (id: string, error: AxiosError) => ({
  type: FAVOURITES_FETCH_FAIL,
  id,
  error,
});

const fetchReactions = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchReactionsRequest(id));

    api(getState).get(`/api/v1/pleroma/statuses/${id}/reactions`).then(response => {
      dispatch(importFetchedAccounts((response.data as APIEntity[]).map(({ accounts }) => accounts).flat()));
      dispatch(fetchReactionsSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchReactionsFail(id, error));
    });
  };

const fetchReactionsRequest = (id: string) => ({
  type: REACTIONS_FETCH_REQUEST,
  id,
});

const fetchReactionsSuccess = (id: string, reactions: APIEntity[]) => ({
  type: REACTIONS_FETCH_SUCCESS,
  id,
  reactions,
});

const fetchReactionsFail = (id: string, error: AxiosError) => ({
  type: REACTIONS_FETCH_FAIL,
  id,
  error,
});

const pin = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(pinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/pin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(pinSuccess(status));
    }).catch(error => {
      dispatch(pinFail(status, error));
    });
  };

const pinRequest = (status: StatusEntity) => ({
  type: PIN_REQUEST,
  status,
  skipLoading: true,
});

const pinSuccess = (status: StatusEntity) => ({
  type: PIN_SUCCESS,
  status,
  skipLoading: true,
});

const pinFail = (status: StatusEntity, error: AxiosError) => ({
  type: PIN_FAIL,
  status,
  error,
  skipLoading: true,
});

const unpin = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unpinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unpin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unpinSuccess(status));
    }).catch(error => {
      dispatch(unpinFail(status, error));
    });
  };

const togglePin = (status: StatusEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (status.pinned) {
      dispatch(unpin(status));
    } else {
      dispatch(pin(status));
    }
  };

const unpinRequest = (status: StatusEntity) => ({
  type: UNPIN_REQUEST,
  status,
  skipLoading: true,
});

const unpinSuccess = (status: StatusEntity) => ({
  type: UNPIN_SUCCESS,
  status,
  skipLoading: true,
});

const unpinFail = (status: StatusEntity, error: AxiosError) => ({
  type: UNPIN_FAIL,
  status,
  error,
  skipLoading: true,
});

const remoteInteraction = (ap_id: string, profile: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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

const remoteInteractionRequest = (ap_id: string, profile: string) => ({
  type: REMOTE_INTERACTION_REQUEST,
  ap_id,
  profile,
});

const remoteInteractionSuccess = (ap_id: string, profile: string, url: string) => ({
  type: REMOTE_INTERACTION_SUCCESS,
  ap_id,
  profile,
  url,
});

const remoteInteractionFail = (ap_id: string, profile: string, error: AxiosError) => ({
  type: REMOTE_INTERACTION_FAIL,
  ap_id,
  profile,
  error,
});

export {
  REBLOG_REQUEST,
  REBLOG_SUCCESS,
  REBLOG_FAIL,
  FAVOURITE_REQUEST,
  FAVOURITE_SUCCESS,
  FAVOURITE_FAIL,
  UNREBLOG_REQUEST,
  UNREBLOG_SUCCESS,
  UNREBLOG_FAIL,
  UNFAVOURITE_REQUEST,
  UNFAVOURITE_SUCCESS,
  UNFAVOURITE_FAIL,
  REBLOGS_FETCH_REQUEST,
  REBLOGS_FETCH_SUCCESS,
  REBLOGS_FETCH_FAIL,
  FAVOURITES_FETCH_REQUEST,
  FAVOURITES_FETCH_SUCCESS,
  FAVOURITES_FETCH_FAIL,
  REACTIONS_FETCH_REQUEST,
  REACTIONS_FETCH_SUCCESS,
  REACTIONS_FETCH_FAIL,
  PIN_REQUEST,
  PIN_SUCCESS,
  PIN_FAIL,
  UNPIN_REQUEST,
  UNPIN_SUCCESS,
  UNPIN_FAIL,
  BOOKMARK_REQUEST,
  BOOKMARK_SUCCESS,
  BOOKMARK_FAIL,
  UNBOOKMARK_REQUEST,
  UNBOOKMARK_SUCCESS,
  UNBOOKMARK_FAIL,
  REMOTE_INTERACTION_REQUEST,
  REMOTE_INTERACTION_SUCCESS,
  REMOTE_INTERACTION_FAIL,
  reblog,
  unreblog,
  toggleReblog,
  reblogRequest,
  reblogSuccess,
  reblogFail,
  unreblogRequest,
  unreblogSuccess,
  unreblogFail,
  favourite,
  unfavourite,
  toggleFavourite,
  favouriteRequest,
  favouriteSuccess,
  favouriteFail,
  unfavouriteRequest,
  unfavouriteSuccess,
  unfavouriteFail,
  bookmark,
  unbookmark,
  toggleBookmark,
  bookmarkRequest,
  bookmarkSuccess,
  bookmarkFail,
  unbookmarkRequest,
  unbookmarkSuccess,
  unbookmarkFail,
  fetchReblogs,
  fetchReblogsRequest,
  fetchReblogsSuccess,
  fetchReblogsFail,
  fetchFavourites,
  fetchFavouritesRequest,
  fetchFavouritesSuccess,
  fetchFavouritesFail,
  fetchReactions,
  fetchReactionsRequest,
  fetchReactionsSuccess,
  fetchReactionsFail,
  pin,
  pinRequest,
  pinSuccess,
  pinFail,
  unpin,
  unpinRequest,
  unpinSuccess,
  unpinFail,
  togglePin,
  remoteInteraction,
  remoteInteractionRequest,
  remoteInteractionSuccess,
  remoteInteractionFail,
};
