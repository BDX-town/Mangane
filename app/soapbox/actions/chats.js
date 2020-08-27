import api from '../api';
import { getSettings, changeSetting } from 'soapbox/actions/settings';
import { Map as ImmutableMap } from 'immutable';

export const CHATS_FETCH_REQUEST = 'CHATS_FETCH_REQUEST';
export const CHATS_FETCH_SUCCESS = 'CHATS_FETCH_SUCCESS';
export const CHATS_FETCH_FAIL    = 'CHATS_FETCH_FAIL';

export const CHAT_MESSAGES_FETCH_REQUEST = 'CHAT_MESSAGES_FETCH_REQUEST';
export const CHAT_MESSAGES_FETCH_SUCCESS = 'CHAT_MESSAGES_FETCH_SUCCESS';
export const CHAT_MESSAGES_FETCH_FAIL    = 'CHAT_MESSAGES_FETCH_FAIL';

export const CHAT_MESSAGE_SEND_REQUEST = 'CHAT_MESSAGE_SEND_REQUEST';
export const CHAT_MESSAGE_SEND_SUCCESS = 'CHAT_MESSAGE_SEND_SUCCESS';
export const CHAT_MESSAGE_SEND_FAIL    = 'CHAT_MESSAGE_SEND_FAIL';

export const CHAT_FETCH_REQUEST = 'CHAT_FETCH_REQUEST';
export const CHAT_FETCH_SUCCESS = 'CHAT_FETCH_SUCCESS';
export const CHAT_FETCH_FAIL    = 'CHAT_FETCH_FAIL';

export function fetchChats() {
  return (dispatch, getState) => {
    dispatch({ type: CHATS_FETCH_REQUEST });
    return api(getState).get('/api/v1/pleroma/chats').then(({ data }) => {
      dispatch({ type: CHATS_FETCH_SUCCESS, chats: data });
    }).catch(error => {
      dispatch({ type: CHATS_FETCH_FAIL, error });
    });
  };
}

export function fetchChatMessages(chatId) {
  return (dispatch, getState) => {
    dispatch({ type: CHAT_MESSAGES_FETCH_REQUEST, chatId });
    return api(getState).get(`/api/v1/pleroma/chats/${chatId}/messages`).then(({ data }) => {
      dispatch({ type: CHAT_MESSAGES_FETCH_SUCCESS, chatId, chatMessages: data });
    }).catch(error => {
      dispatch({ type: CHAT_MESSAGES_FETCH_FAIL, chatId, error });
    });
  };
}

export function sendChatMessage(chatId, params) {
  return (dispatch, getState) => {
    dispatch({ type: CHAT_MESSAGE_SEND_REQUEST, chatId, params });
    return api(getState).post(`/api/v1/pleroma/chats/${chatId}/messages`, params).then(({ data }) => {
      dispatch({ type: CHAT_MESSAGE_SEND_SUCCESS, chatId, chatMessage: data });
    }).catch(error => {
      dispatch({ type: CHAT_MESSAGE_SEND_FAIL, chatId, error });
    });
  };
}

export function openChat(chatId) {
  return (dispatch, getState) => {
    const panes = getSettings(getState()).getIn(['chats', 'panes']);
    const idx = panes.findIndex(pane => pane.get('chat_id') === chatId);

    if (idx > -1) {
      return dispatch(changeSetting(['chats', 'panes', idx, 'state'], 'open'));
    } else {
      const newPane = ImmutableMap({ chat_id: chatId, state: 'open' });
      return dispatch(changeSetting(['chats', 'panes'], panes.push(newPane)));
    }
  };
}

export function closeChat(chatId) {
  return (dispatch, getState) => {
    const panes = getSettings(getState()).getIn(['chats', 'panes']);
    const idx = panes.findIndex(pane => pane.get('chat_id') === chatId);

    if (idx > -1) {
      return dispatch(changeSetting(['chats', 'panes'], panes.delete(idx)));
    } else {
      return false;
    }
  };
}

export function toggleChat(chatId) {
  return (dispatch, getState) => {
    const panes = getSettings(getState()).getIn(['chats', 'panes']);
    const [idx, pane] = panes.findEntry(pane => pane.get('chat_id') === chatId);

    if (idx > -1) {
      const state = pane.get('state') === 'minimized' ? 'open' : 'minimized';
      return dispatch(changeSetting(['chats', 'panes', idx, 'state'], state));
    } else {
      return false;
    }
  };
}

export function toggleMainWindow() {
  return (dispatch, getState) => {
    const main = getSettings(getState()).getIn(['chats', 'mainWindow']);
    const state = main === 'minimized' ? 'open' : 'minimized';
    return dispatch(changeSetting(['chats', 'mainWindow'], state));
  };
}

export function startChat(accountId) {
  return (dispatch, getState) => {
    dispatch({ type: CHAT_FETCH_REQUEST, accountId });
    return api(getState).post(`/api/v1/pleroma/chats/by-account-id/${accountId}`).then(({ data }) => {
      dispatch({ type: CHAT_FETCH_SUCCESS, chat: data });
    }).catch(error => {
      dispatch({ type: CHAT_FETCH_FAIL, accountId, error });
    });
  };
}
