import { isLoggedIn } from 'soapbox/utils/auth';

import api, { getLinks } from '../api';

import {
  importFetchedAccounts,
  importFetchedStatuses,
  importFetchedStatus,
} from './importer';

export const CONVERSATIONS_MOUNT   = 'CONVERSATIONS_MOUNT';
export const CONVERSATIONS_UNMOUNT = 'CONVERSATIONS_UNMOUNT';

export const CONVERSATIONS_FETCH_REQUEST = 'CONVERSATIONS_FETCH_REQUEST';
export const CONVERSATIONS_FETCH_SUCCESS = 'CONVERSATIONS_FETCH_SUCCESS';
export const CONVERSATIONS_FETCH_FAIL    = 'CONVERSATIONS_FETCH_FAIL';
export const CONVERSATIONS_UPDATE        = 'CONVERSATIONS_UPDATE';

export const CONVERSATIONS_READ = 'CONVERSATIONS_READ';

export const mountConversations = () => ({
  type: CONVERSATIONS_MOUNT,
});

export const unmountConversations = () => ({
  type: CONVERSATIONS_UNMOUNT,
});

export const markConversationRead = conversationId => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;

  dispatch({
    type: CONVERSATIONS_READ,
    id: conversationId,
  });

  api(getState).post(`/api/v1/conversations/${conversationId}/read`);
};

export const expandConversations = ({ maxId } = {}) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;

  dispatch(expandConversationsRequest());

  const params = { max_id: maxId };

  if (!maxId) {
    params.since_id = getState().getIn(['conversations', 'items', 0, 'id']);
  }

  const isLoadingRecent = !!params.since_id;

  api(getState).get('/api/v1/conversations', { params })
    .then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data.reduce((aggr, item) => aggr.concat(item.accounts), [])));
      dispatch(importFetchedStatuses(response.data.map(item => item.last_status).filter(x => !!x)));
      dispatch(expandConversationsSuccess(response.data, next ? next.uri : null, isLoadingRecent));
    })
    .catch(err => dispatch(expandConversationsFail(err)));
};

export const expandConversationsRequest = () => ({
  type: CONVERSATIONS_FETCH_REQUEST,
});

export const expandConversationsSuccess = (conversations, next, isLoadingRecent) => ({
  type: CONVERSATIONS_FETCH_SUCCESS,
  conversations,
  next,
  isLoadingRecent,
});

export const expandConversationsFail = error => ({
  type: CONVERSATIONS_FETCH_FAIL,
  error,
});

export const updateConversations = conversation => dispatch => {
  dispatch(importFetchedAccounts(conversation.accounts));

  if (conversation.last_status) {
    dispatch(importFetchedStatus(conversation.last_status));
  }

  dispatch({
    type: CONVERSATIONS_UPDATE,
    conversation,
  });
};
