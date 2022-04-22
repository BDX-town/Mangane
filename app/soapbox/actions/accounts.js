import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';

import api, { getLinks } from '../api';

import {
  importFetchedAccount,
  importFetchedAccounts,
  importErrorWhileFetchingAccountByUsername,
} from './importer';

export const ACCOUNT_CREATE_REQUEST = 'ACCOUNT_CREATE_REQUEST';
export const ACCOUNT_CREATE_SUCCESS = 'ACCOUNT_CREATE_SUCCESS';
export const ACCOUNT_CREATE_FAIL    = 'ACCOUNT_CREATE_FAIL';

export const ACCOUNT_FETCH_REQUEST = 'ACCOUNT_FETCH_REQUEST';
export const ACCOUNT_FETCH_SUCCESS = 'ACCOUNT_FETCH_SUCCESS';
export const ACCOUNT_FETCH_FAIL    = 'ACCOUNT_FETCH_FAIL';

export const ACCOUNT_FOLLOW_REQUEST = 'ACCOUNT_FOLLOW_REQUEST';
export const ACCOUNT_FOLLOW_SUCCESS = 'ACCOUNT_FOLLOW_SUCCESS';
export const ACCOUNT_FOLLOW_FAIL    = 'ACCOUNT_FOLLOW_FAIL';

export const ACCOUNT_UNFOLLOW_REQUEST = 'ACCOUNT_UNFOLLOW_REQUEST';
export const ACCOUNT_UNFOLLOW_SUCCESS = 'ACCOUNT_UNFOLLOW_SUCCESS';
export const ACCOUNT_UNFOLLOW_FAIL    = 'ACCOUNT_UNFOLLOW_FAIL';

export const ACCOUNT_BLOCK_REQUEST = 'ACCOUNT_BLOCK_REQUEST';
export const ACCOUNT_BLOCK_SUCCESS = 'ACCOUNT_BLOCK_SUCCESS';
export const ACCOUNT_BLOCK_FAIL    = 'ACCOUNT_BLOCK_FAIL';

export const ACCOUNT_UNBLOCK_REQUEST = 'ACCOUNT_UNBLOCK_REQUEST';
export const ACCOUNT_UNBLOCK_SUCCESS = 'ACCOUNT_UNBLOCK_SUCCESS';
export const ACCOUNT_UNBLOCK_FAIL    = 'ACCOUNT_UNBLOCK_FAIL';

export const ACCOUNT_MUTE_REQUEST = 'ACCOUNT_MUTE_REQUEST';
export const ACCOUNT_MUTE_SUCCESS = 'ACCOUNT_MUTE_SUCCESS';
export const ACCOUNT_MUTE_FAIL    = 'ACCOUNT_MUTE_FAIL';

export const ACCOUNT_UNMUTE_REQUEST = 'ACCOUNT_UNMUTE_REQUEST';
export const ACCOUNT_UNMUTE_SUCCESS = 'ACCOUNT_UNMUTE_SUCCESS';
export const ACCOUNT_UNMUTE_FAIL    = 'ACCOUNT_UNMUTE_FAIL';

export const ACCOUNT_SUBSCRIBE_REQUEST = 'ACCOUNT_SUBSCRIBE_REQUEST';
export const ACCOUNT_SUBSCRIBE_SUCCESS = 'ACCOUNT_SUBSCRIBE_SUCCESS';
export const ACCOUNT_SUBSCRIBE_FAIL    = 'ACCOUNT_SUBSCRIBE_FAIL';

export const ACCOUNT_UNSUBSCRIBE_REQUEST = 'ACCOUNT_UNSUBSCRIBE_REQUEST';
export const ACCOUNT_UNSUBSCRIBE_SUCCESS = 'ACCOUNT_UNSUBSCRIBE_SUCCESS';
export const ACCOUNT_UNSUBSCRIBE_FAIL    = 'ACCOUNT_UNSUBSCRIBE_FAIL';

export const ACCOUNT_PIN_REQUEST = 'ACCOUNT_PIN_REQUEST';
export const ACCOUNT_PIN_SUCCESS = 'ACCOUNT_PIN_SUCCESS';
export const ACCOUNT_PIN_FAIL    = 'ACCOUNT_PIN_FAIL';

export const ACCOUNT_UNPIN_REQUEST = 'ACCOUNT_UNPIN_REQUEST';
export const ACCOUNT_UNPIN_SUCCESS = 'ACCOUNT_UNPIN_SUCCESS';
export const ACCOUNT_UNPIN_FAIL    = 'ACCOUNT_UNPIN_FAIL';

export const PINNED_ACCOUNTS_FETCH_REQUEST = 'PINNED_ACCOUNTS_FETCH_REQUEST';
export const PINNED_ACCOUNTS_FETCH_SUCCESS = 'PINNED_ACCOUNTS_FETCH_SUCCESS';
export const PINNED_ACCOUNTS_FETCH_FAIL = 'PINNED_ACCOUNTS_FETCH_FAIL';

export const ACCOUNT_SEARCH_REQUEST = 'ACCOUNT_SEARCH_REQUEST';
export const ACCOUNT_SEARCH_SUCCESS = 'ACCOUNT_SEARCH_SUCCESS';
export const ACCOUNT_SEARCH_FAIL    = 'ACCOUNT_SEARCH_FAIL';

export const ACCOUNT_LOOKUP_REQUEST = 'ACCOUNT_LOOKUP_REQUEST';
export const ACCOUNT_LOOKUP_SUCCESS = 'ACCOUNT_LOOKUP_SUCCESS';
export const ACCOUNT_LOOKUP_FAIL    = 'ACCOUNT_LOOKUP_FAIL';

export const FOLLOWERS_FETCH_REQUEST = 'FOLLOWERS_FETCH_REQUEST';
export const FOLLOWERS_FETCH_SUCCESS = 'FOLLOWERS_FETCH_SUCCESS';
export const FOLLOWERS_FETCH_FAIL    = 'FOLLOWERS_FETCH_FAIL';

export const FOLLOWERS_EXPAND_REQUEST = 'FOLLOWERS_EXPAND_REQUEST';
export const FOLLOWERS_EXPAND_SUCCESS = 'FOLLOWERS_EXPAND_SUCCESS';
export const FOLLOWERS_EXPAND_FAIL    = 'FOLLOWERS_EXPAND_FAIL';

export const FOLLOWING_FETCH_REQUEST = 'FOLLOWING_FETCH_REQUEST';
export const FOLLOWING_FETCH_SUCCESS = 'FOLLOWING_FETCH_SUCCESS';
export const FOLLOWING_FETCH_FAIL    = 'FOLLOWING_FETCH_FAIL';

export const FOLLOWING_EXPAND_REQUEST = 'FOLLOWING_EXPAND_REQUEST';
export const FOLLOWING_EXPAND_SUCCESS = 'FOLLOWING_EXPAND_SUCCESS';
export const FOLLOWING_EXPAND_FAIL    = 'FOLLOWING_EXPAND_FAIL';

export const RELATIONSHIPS_FETCH_REQUEST = 'RELATIONSHIPS_FETCH_REQUEST';
export const RELATIONSHIPS_FETCH_SUCCESS = 'RELATIONSHIPS_FETCH_SUCCESS';
export const RELATIONSHIPS_FETCH_FAIL    = 'RELATIONSHIPS_FETCH_FAIL';

export const FOLLOW_REQUESTS_FETCH_REQUEST = 'FOLLOW_REQUESTS_FETCH_REQUEST';
export const FOLLOW_REQUESTS_FETCH_SUCCESS = 'FOLLOW_REQUESTS_FETCH_SUCCESS';
export const FOLLOW_REQUESTS_FETCH_FAIL    = 'FOLLOW_REQUESTS_FETCH_FAIL';

export const FOLLOW_REQUESTS_EXPAND_REQUEST = 'FOLLOW_REQUESTS_EXPAND_REQUEST';
export const FOLLOW_REQUESTS_EXPAND_SUCCESS = 'FOLLOW_REQUESTS_EXPAND_SUCCESS';
export const FOLLOW_REQUESTS_EXPAND_FAIL    = 'FOLLOW_REQUESTS_EXPAND_FAIL';

export const FOLLOW_REQUEST_AUTHORIZE_REQUEST = 'FOLLOW_REQUEST_AUTHORIZE_REQUEST';
export const FOLLOW_REQUEST_AUTHORIZE_SUCCESS = 'FOLLOW_REQUEST_AUTHORIZE_SUCCESS';
export const FOLLOW_REQUEST_AUTHORIZE_FAIL    = 'FOLLOW_REQUEST_AUTHORIZE_FAIL';

export const FOLLOW_REQUEST_REJECT_REQUEST = 'FOLLOW_REQUEST_REJECT_REQUEST';
export const FOLLOW_REQUEST_REJECT_SUCCESS = 'FOLLOW_REQUEST_REJECT_SUCCESS';
export const FOLLOW_REQUEST_REJECT_FAIL    = 'FOLLOW_REQUEST_REJECT_FAIL';

export const NOTIFICATION_SETTINGS_REQUEST = 'NOTIFICATION_SETTINGS_REQUEST';
export const NOTIFICATION_SETTINGS_SUCCESS = 'NOTIFICATION_SETTINGS_SUCCESS';
export const NOTIFICATION_SETTINGS_FAIL    = 'NOTIFICATION_SETTINGS_FAIL';

export const BIRTHDAY_REMINDERS_FETCH_REQUEST = 'BIRTHDAY_REMINDERS_FETCH_REQUEST';
export const BIRTHDAY_REMINDERS_FETCH_SUCCESS = 'BIRTHDAY_REMINDERS_FETCH_SUCCESS';
export const BIRTHDAY_REMINDERS_FETCH_FAIL    = 'BIRTHDAY_REMINDERS_FETCH_FAIL';

export function createAccount(params) {
  return (dispatch, getState) => {
    dispatch({ type: ACCOUNT_CREATE_REQUEST, params });
    return api(getState, 'app').post('/api/v1/accounts', params).then(({ data: token }) => {
      return dispatch({ type: ACCOUNT_CREATE_SUCCESS, params, token });
    }).catch(error => {
      dispatch({ type: ACCOUNT_CREATE_FAIL, error, params });
      throw error;
    });
  };
}

export function fetchAccount(id) {
  return (dispatch, getState) => {
    dispatch(fetchRelationships([id]));

    const account = getState().getIn(['accounts', id]);

    if (account && !account.get('should_refetch')) {
      return;
    }

    dispatch(fetchAccountRequest(id));

    api(getState).get(`/api/v1/accounts/${id}`).then(response => {
      dispatch(importFetchedAccount(response.data));
      dispatch(fetchAccountSuccess(response.data));
    }).catch(error => {
      dispatch(fetchAccountFail(id, error));
    });
  };
}

export function fetchAccountByUsername(username) {
  return (dispatch, getState) => {
    const state = getState();
    const account = state.get('accounts').find(account => account.get('acct') === username);

    if (account) {
      dispatch(fetchAccount(account.get('id')));
      return;
    }

    const instance = state.get('instance');
    const features = getFeatures(instance);
    const me = state.get('me');

    if (features.accountByUsername && (me || !features.accountLookup)) {
      api(getState).get(`/api/v1/accounts/${username}`).then(response => {
        dispatch(fetchRelationships([response.data.id]));
        dispatch(importFetchedAccount(response.data));
        dispatch(fetchAccountSuccess(response.data));
      }).catch(error => {
        dispatch(fetchAccountFail(null, error));
        dispatch(importErrorWhileFetchingAccountByUsername(username));
      });
    } else if (features.accountLookup) {
      dispatch(accountLookup(username)).then(account => {
        dispatch(fetchAccountSuccess(account));
      }).catch(error => {
        dispatch(fetchAccountFail(null, error));
        dispatch(importErrorWhileFetchingAccountByUsername(username));
      });
    } else {
      dispatch(accountSearch({
        q: username,
        limit: 5,
        resolve: true,
      })).then(accounts => {
        const found = accounts.find(a => a.acct === username);

        if (found) {
          dispatch(fetchRelationships([found.id]));
          dispatch(fetchAccountSuccess(found));
        } else {
          throw accounts;
        }
      }).catch(error => {
        dispatch(fetchAccountFail(null, error));
        dispatch(importErrorWhileFetchingAccountByUsername(username));
      });
    }
  };
}

export function fetchAccountRequest(id) {
  return {
    type: ACCOUNT_FETCH_REQUEST,
    id,
  };
}

export function fetchAccountSuccess(account) {
  return {
    type: ACCOUNT_FETCH_SUCCESS,
    account,
  };
}

export function fetchAccountFail(id, error) {
  return {
    type: ACCOUNT_FETCH_FAIL,
    id,
    error,
    skipAlert: true,
  };
}

export function followAccount(id, options = { reblogs: true }) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const alreadyFollowing = getState().getIn(['relationships', id, 'following']);
    const locked = getState().getIn(['accounts', id, 'locked'], false);

    dispatch(followAccountRequest(id, locked));

    api(getState).post(`/api/v1/accounts/${id}/follow`, options).then(response => {
      dispatch(followAccountSuccess(response.data, alreadyFollowing));
    }).catch(error => {
      dispatch(followAccountFail(error, locked));
    });
  };
}

export function unfollowAccount(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unfollowAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/unfollow`).then(response => {
      dispatch(unfollowAccountSuccess(response.data, getState().get('statuses')));
    }).catch(error => {
      dispatch(unfollowAccountFail(error));
    });
  };
}

export function followAccountRequest(id, locked) {
  return {
    type: ACCOUNT_FOLLOW_REQUEST,
    id,
    locked,
    skipLoading: true,
  };
}

export function followAccountSuccess(relationship, alreadyFollowing) {
  return {
    type: ACCOUNT_FOLLOW_SUCCESS,
    relationship,
    alreadyFollowing,
    skipLoading: true,
  };
}

export function followAccountFail(error, locked) {
  return {
    type: ACCOUNT_FOLLOW_FAIL,
    error,
    locked,
    skipLoading: true,
  };
}

export function unfollowAccountRequest(id) {
  return {
    type: ACCOUNT_UNFOLLOW_REQUEST,
    id,
    skipLoading: true,
  };
}

export function unfollowAccountSuccess(relationship, statuses) {
  return {
    type: ACCOUNT_UNFOLLOW_SUCCESS,
    relationship,
    statuses,
    skipLoading: true,
  };
}

export function unfollowAccountFail(error) {
  return {
    type: ACCOUNT_UNFOLLOW_FAIL,
    error,
    skipLoading: true,
  };
}

export function blockAccount(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(blockAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/block`).then(response => {
      // Pass in entire statuses map so we can use it to filter stuff in different parts of the reducers
      dispatch(blockAccountSuccess(response.data, getState().get('statuses')));
    }).catch(error => {
      dispatch(blockAccountFail(id, error));
    });
  };
}

export function unblockAccount(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unblockAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/unblock`).then(response => {
      dispatch(unblockAccountSuccess(response.data));
    }).catch(error => {
      dispatch(unblockAccountFail(id, error));
    });
  };
}

export function blockAccountRequest(id) {
  return {
    type: ACCOUNT_BLOCK_REQUEST,
    id,
  };
}

export function blockAccountSuccess(relationship, statuses) {
  return {
    type: ACCOUNT_BLOCK_SUCCESS,
    relationship,
    statuses,
  };
}

export function blockAccountFail(error) {
  return {
    type: ACCOUNT_BLOCK_FAIL,
    error,
  };
}

export function unblockAccountRequest(id) {
  return {
    type: ACCOUNT_UNBLOCK_REQUEST,
    id,
  };
}

export function unblockAccountSuccess(relationship) {
  return {
    type: ACCOUNT_UNBLOCK_SUCCESS,
    relationship,
  };
}

export function unblockAccountFail(error) {
  return {
    type: ACCOUNT_UNBLOCK_FAIL,
    error,
  };
}


export function muteAccount(id, notifications) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(muteAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/mute`, { notifications }).then(response => {
      // Pass in entire statuses map so we can use it to filter stuff in different parts of the reducers
      dispatch(muteAccountSuccess(response.data, getState().get('statuses')));
    }).catch(error => {
      dispatch(muteAccountFail(id, error));
    });
  };
}

export function unmuteAccount(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unmuteAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/unmute`).then(response => {
      dispatch(unmuteAccountSuccess(response.data));
    }).catch(error => {
      dispatch(unmuteAccountFail(id, error));
    });
  };
}

export function muteAccountRequest(id) {
  return {
    type: ACCOUNT_MUTE_REQUEST,
    id,
  };
}

export function muteAccountSuccess(relationship, statuses) {
  return {
    type: ACCOUNT_MUTE_SUCCESS,
    relationship,
    statuses,
  };
}

export function muteAccountFail(error) {
  return {
    type: ACCOUNT_MUTE_FAIL,
    error,
  };
}

export function unmuteAccountRequest(id) {
  return {
    type: ACCOUNT_UNMUTE_REQUEST,
    id,
  };
}

export function unmuteAccountSuccess(relationship) {
  return {
    type: ACCOUNT_UNMUTE_SUCCESS,
    relationship,
  };
}

export function unmuteAccountFail(error) {
  return {
    type: ACCOUNT_UNMUTE_FAIL,
    error,
  };
}


export function subscribeAccount(id, notifications) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(subscribeAccountRequest(id));

    api(getState).post(`/api/v1/pleroma/accounts/${id}/subscribe`, { notifications }).then(response => {
      dispatch(subscribeAccountSuccess(response.data));
    }).catch(error => {
      dispatch(subscribeAccountFail(id, error));
    });
  };
}

export function unsubscribeAccount(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unsubscribeAccountRequest(id));

    api(getState).post(`/api/v1/pleroma/accounts/${id}/unsubscribe`).then(response => {
      dispatch(unsubscribeAccountSuccess(response.data));
    }).catch(error => {
      dispatch(unsubscribeAccountFail(id, error));
    });
  };
}

export function subscribeAccountRequest(id) {
  return {
    type: ACCOUNT_SUBSCRIBE_REQUEST,
    id,
  };
}

export function subscribeAccountSuccess(relationship) {
  return {
    type: ACCOUNT_SUBSCRIBE_SUCCESS,
    relationship,
  };
}

export function subscribeAccountFail(error) {
  return {
    type: ACCOUNT_SUBSCRIBE_FAIL,
    error,
  };
}

export function unsubscribeAccountRequest(id) {
  return {
    type: ACCOUNT_UNSUBSCRIBE_REQUEST,
    id,
  };
}

export function unsubscribeAccountSuccess(relationship) {
  return {
    type: ACCOUNT_UNSUBSCRIBE_SUCCESS,
    relationship,
  };
}

export function unsubscribeAccountFail(error) {
  return {
    type: ACCOUNT_UNSUBSCRIBE_FAIL,
    error,
  };
}

export function fetchFollowers(id) {
  return (dispatch, getState) => {
    dispatch(fetchFollowersRequest(id));

    api(getState).get(`/api/v1/accounts/${id}/followers`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchFollowersSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchFollowersFail(id, error));
    });
  };
}

export function fetchFollowersRequest(id) {
  return {
    type: FOLLOWERS_FETCH_REQUEST,
    id,
  };
}

export function fetchFollowersSuccess(id, accounts, next) {
  return {
    type: FOLLOWERS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchFollowersFail(id, error) {
  return {
    type: FOLLOWERS_FETCH_FAIL,
    id,
    error,
  };
}

export function expandFollowers(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().getIn(['user_lists', 'followers', id, 'next']);

    if (url === null) {
      return;
    }

    dispatch(expandFollowersRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandFollowersSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(expandFollowersFail(id, error));
    });
  };
}

export function expandFollowersRequest(id) {
  return {
    type: FOLLOWERS_EXPAND_REQUEST,
    id,
  };
}

export function expandFollowersSuccess(id, accounts, next) {
  return {
    type: FOLLOWERS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function expandFollowersFail(id, error) {
  return {
    type: FOLLOWERS_EXPAND_FAIL,
    id,
    error,
  };
}

export function fetchFollowing(id) {
  return (dispatch, getState) => {
    dispatch(fetchFollowingRequest(id));

    api(getState).get(`/api/v1/accounts/${id}/following`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchFollowingSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchFollowingFail(id, error));
    });
  };
}

export function fetchFollowingRequest(id) {
  return {
    type: FOLLOWING_FETCH_REQUEST,
    id,
  };
}

export function fetchFollowingSuccess(id, accounts, next) {
  return {
    type: FOLLOWING_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchFollowingFail(id, error) {
  return {
    type: FOLLOWING_FETCH_FAIL,
    id,
    error,
  };
}

export function expandFollowing(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().getIn(['user_lists', 'following', id, 'next']);

    if (url === null) {
      return;
    }

    dispatch(expandFollowingRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandFollowingSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(expandFollowingFail(id, error));
    });
  };
}

export function expandFollowingRequest(id) {
  return {
    type: FOLLOWING_EXPAND_REQUEST,
    id,
  };
}

export function expandFollowingSuccess(id, accounts, next) {
  return {
    type: FOLLOWING_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function expandFollowingFail(id, error) {
  return {
    type: FOLLOWING_EXPAND_FAIL,
    id,
    error,
  };
}

export function fetchRelationships(accountIds) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const loadedRelationships = getState().get('relationships');
    const newAccountIds = accountIds.filter(id => loadedRelationships.get(id, null) === null);

    if (newAccountIds.length === 0) {
      return;
    }

    dispatch(fetchRelationshipsRequest(newAccountIds));

    api(getState).get(`/api/v1/accounts/relationships?${newAccountIds.map(id => `id[]=${id}`).join('&')}`).then(response => {
      dispatch(fetchRelationshipsSuccess(response.data));
    }).catch(error => {
      dispatch(fetchRelationshipsFail(error));
    });
  };
}

export function fetchRelationshipsRequest(ids) {
  return {
    type: RELATIONSHIPS_FETCH_REQUEST,
    ids,
    skipLoading: true,
  };
}

export function fetchRelationshipsSuccess(relationships) {
  return {
    type: RELATIONSHIPS_FETCH_SUCCESS,
    relationships,
    skipLoading: true,
  };
}

export function fetchRelationshipsFail(error) {
  return {
    type: RELATIONSHIPS_FETCH_FAIL,
    error,
    skipLoading: true,
  };
}

export function fetchFollowRequests() {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchFollowRequestsRequest());

    api(getState).get('/api/v1/follow_requests').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchFollowRequestsSuccess(response.data, next ? next.uri : null));
    }).catch(error => dispatch(fetchFollowRequestsFail(error)));
  };
}

export function fetchFollowRequestsRequest() {
  return {
    type: FOLLOW_REQUESTS_FETCH_REQUEST,
  };
}

export function fetchFollowRequestsSuccess(accounts, next) {
  return {
    type: FOLLOW_REQUESTS_FETCH_SUCCESS,
    accounts,
    next,
  };
}

export function fetchFollowRequestsFail(error) {
  return {
    type: FOLLOW_REQUESTS_FETCH_FAIL,
    error,
  };
}

export function expandFollowRequests() {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().getIn(['user_lists', 'follow_requests', 'next']);

    if (url === null) {
      return;
    }

    dispatch(expandFollowRequestsRequest());

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(expandFollowRequestsSuccess(response.data, next ? next.uri : null));
    }).catch(error => dispatch(expandFollowRequestsFail(error)));
  };
}

export function expandFollowRequestsRequest() {
  return {
    type: FOLLOW_REQUESTS_EXPAND_REQUEST,
  };
}

export function expandFollowRequestsSuccess(accounts, next) {
  return {
    type: FOLLOW_REQUESTS_EXPAND_SUCCESS,
    accounts,
    next,
  };
}

export function expandFollowRequestsFail(error) {
  return {
    type: FOLLOW_REQUESTS_EXPAND_FAIL,
    error,
  };
}

export function authorizeFollowRequest(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(authorizeFollowRequestRequest(id));

    api(getState)
      .post(`/api/v1/follow_requests/${id}/authorize`)
      .then(() => dispatch(authorizeFollowRequestSuccess(id)))
      .catch(error => dispatch(authorizeFollowRequestFail(id, error)));
  };
}

export function authorizeFollowRequestRequest(id) {
  return {
    type: FOLLOW_REQUEST_AUTHORIZE_REQUEST,
    id,
  };
}

export function authorizeFollowRequestSuccess(id) {
  return {
    type: FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
    id,
  };
}

export function authorizeFollowRequestFail(id, error) {
  return {
    type: FOLLOW_REQUEST_AUTHORIZE_FAIL,
    id,
    error,
  };
}


export function rejectFollowRequest(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(rejectFollowRequestRequest(id));

    api(getState)
      .post(`/api/v1/follow_requests/${id}/reject`)
      .then(() => dispatch(rejectFollowRequestSuccess(id)))
      .catch(error => dispatch(rejectFollowRequestFail(id, error)));
  };
}

export function rejectFollowRequestRequest(id) {
  return {
    type: FOLLOW_REQUEST_REJECT_REQUEST,
    id,
  };
}

export function rejectFollowRequestSuccess(id) {
  return {
    type: FOLLOW_REQUEST_REJECT_SUCCESS,
    id,
  };
}

export function rejectFollowRequestFail(id, error) {
  return {
    type: FOLLOW_REQUEST_REJECT_FAIL,
    id,
    error,
  };
}

export function pinAccount(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(pinAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/pin`).then(response => {
      dispatch(pinAccountSuccess(response.data));
    }).catch(error => {
      dispatch(pinAccountFail(error));
    });
  };
}

export function unpinAccount(id) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(unpinAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/unpin`).then(response => {
      dispatch(unpinAccountSuccess(response.data));
    }).catch(error => {
      dispatch(unpinAccountFail(error));
    });
  };
}

export function updateNotificationSettings(params) {
  return (dispatch, getState) => {
    dispatch({ type: NOTIFICATION_SETTINGS_REQUEST, params });
    return api(getState).put('/api/pleroma/notification_settings', params).then(({ data }) => {
      dispatch({ type: NOTIFICATION_SETTINGS_SUCCESS, params, data });
    }).catch(error => {
      dispatch({ type: NOTIFICATION_SETTINGS_FAIL, params, error });
      throw error;
    });
  };
}

export function pinAccountRequest(id) {
  return {
    type: ACCOUNT_PIN_REQUEST,
    id,
  };
}

export function pinAccountSuccess(relationship) {
  return {
    type: ACCOUNT_PIN_SUCCESS,
    relationship,
  };
}

export function pinAccountFail(error) {
  return {
    type: ACCOUNT_PIN_FAIL,
    error,
  };
}

export function unpinAccountRequest(id) {
  return {
    type: ACCOUNT_UNPIN_REQUEST,
    id,
  };
}

export function unpinAccountSuccess(relationship) {
  return {
    type: ACCOUNT_UNPIN_SUCCESS,
    relationship,
  };
}

export function unpinAccountFail(error) {
  return {
    type: ACCOUNT_UNPIN_FAIL,
    error,
  };
}

export function fetchPinnedAccounts(id) {
  return (dispatch, getState) => {
    dispatch(fetchPinnedAccountsRequest(id));

    api(getState).get(`/api/v1/pleroma/accounts/${id}/endorsements`).then(response => {
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchPinnedAccountsSuccess(id, response.data, null));
    }).catch(error => {
      dispatch(fetchPinnedAccountsFail(id, error));
    });
  };
}

export function fetchPinnedAccountsRequest(id) {
  return {
    type: PINNED_ACCOUNTS_FETCH_REQUEST,
    id,
  };
}

export function fetchPinnedAccountsSuccess(id, accounts, next) {
  return {
    type: PINNED_ACCOUNTS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchPinnedAccountsFail(id, error) {
  return {
    type: PINNED_ACCOUNTS_FETCH_FAIL,
    id,
    error,
  };
}

export function accountSearch(params, cancelToken) {
  return (dispatch, getState) => {
    dispatch({ type: ACCOUNT_SEARCH_REQUEST, params });
    return api(getState).get('/api/v1/accounts/search', { params, cancelToken }).then(({ data: accounts }) => {
      dispatch(importFetchedAccounts(accounts));
      dispatch({ type: ACCOUNT_SEARCH_SUCCESS, accounts });
      return accounts;
    }).catch(error => {
      dispatch({ type: ACCOUNT_SEARCH_FAIL, skipAlert: true });
      throw error;
    });
  };
}

export function accountLookup(acct, cancelToken) {
  return (dispatch, getState) => {
    dispatch({ type: ACCOUNT_LOOKUP_REQUEST, acct });
    return api(getState).get('/api/v1/accounts/lookup', { params: { acct }, cancelToken }).then(({ data: account }) => {
      if (account && account.id) dispatch(importFetchedAccount(account));
      dispatch({ type: ACCOUNT_LOOKUP_SUCCESS, account });
      return account;
    }).catch(error => {
      dispatch({ type: ACCOUNT_LOOKUP_FAIL });
      throw error;
    });
  };
}

export function fetchBirthdayReminders(day, month) {
  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) return;

    const me = getState().get('me');

    dispatch({ type: BIRTHDAY_REMINDERS_FETCH_REQUEST, day, month, id: me });

    api(getState).get('/api/v1/pleroma/birthdays', { params: { day, month } }).then(response => {
      dispatch(importFetchedAccounts(response.data));
      dispatch({
        type: BIRTHDAY_REMINDERS_FETCH_SUCCESS,
        accounts: response.data,
        day,
        month,
        id: me,
      });
    }).catch(error => {
      dispatch({ type: BIRTHDAY_REMINDERS_FETCH_FAIL, day, month, id: me });
    });
  };
}
