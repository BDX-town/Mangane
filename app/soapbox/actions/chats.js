import api from '../api';
import { getSettings, changeSetting } from 'soapbox/actions/settings';
import { v4 as uuidv4 } from 'uuid';
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

export const CHAT_READ_REQUEST = 'CHAT_READ_REQUEST';
export const CHAT_READ_SUCCESS = 'CHAT_READ_SUCCESS';
export const CHAT_READ_FAIL    = 'CHAT_READ_FAIL';

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

export function fetchChatMessages(chatId, maxId = null) {
  return (dispatch, getState) => {
    dispatch({ type: CHAT_MESSAGES_FETCH_REQUEST, chatId, maxId });
    return api(getState).get(`/api/v1/pleroma/chats/${chatId}/messages`, { params: { max_id: maxId } }).then(({ data }) => {
      dispatch({ type: CHAT_MESSAGES_FETCH_SUCCESS, chatId, maxId, chatMessages: data });
    }).catch(error => {
      dispatch({ type: CHAT_MESSAGES_FETCH_FAIL, chatId, maxId, error });
    });
  };
}

export function sendChatMessage(chatId, params) {
  return (dispatch, getState) => {
    const uuid = `末_${Date.now()}_${uuidv4()}`;
    const me = getState().get('me');
    dispatch({ type: CHAT_MESSAGE_SEND_REQUEST, chatId, params, uuid, me });
    return api(getState).post(`/api/v1/pleroma/chats/${chatId}/messages`, params).then(({ data }) => {
      dispatch({ type: CHAT_MESSAGE_SEND_SUCCESS, chatId, chatMessage: data, uuid });
    }).catch(error => {
      dispatch({ type: CHAT_MESSAGE_SEND_FAIL, chatId, error, uuid });
    });
  };
}

export function openChat(chatId) {
  return (dispatch, getState) => {
    const state = getState();
    const panes = getSettings(state).getIn(['chats', 'panes']);
    const idx = panes.findIndex(pane => pane.get('chat_id') === chatId);

    dispatch(markChatRead(chatId));

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
      if (state === 'open') dispatch(markChatRead(chatId));
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

export function fetchChat(chatId) {
  return (dispatch, getState) => {
    dispatch({ type: CHAT_FETCH_REQUEST, chatId });
    return api(getState).get(`/api/v1/pleroma/chats/${chatId}`).then(({ data }) => {
      dispatch({ type: CHAT_FETCH_SUCCESS, chat: data });
    }).catch(error => {
      dispatch({ type: CHAT_FETCH_FAIL, chatId, error });
    });
  };
}

export function startChat(accountId) {
  return (dispatch, getState) => {
    dispatch({ type: CHAT_FETCH_REQUEST, accountId });
    return api(getState).post(`/api/v1/pleroma/chats/by-account-id/${accountId}`).then(({ data }) => {
      dispatch({ type: CHAT_FETCH_SUCCESS, chat: data });
      return data;
    }).catch(error => {
      dispatch({ type: CHAT_FETCH_FAIL, accountId, error });
    });
  };
}

export function markChatRead(chatId, lastReadId) {
  return (dispatch, getState) => {
    const chat = getState().getIn(['chats', chatId]);
    if (!lastReadId) lastReadId = chat.get('last_message');

    if (chat.get('unread') < 1) return;
    if (!lastReadId) return;

    dispatch({ type: CHAT_READ_REQUEST, chatId, lastReadId });
    api(getState).post(`/api/v1/pleroma/chats/${chatId}/read`, { last_read_id: lastReadId }).then(({ data }) => {
      dispatch({ type: CHAT_READ_SUCCESS, chat: data, lastReadId });
    }).catch(error => {
      dispatch({ type: CHAT_READ_FAIL, chatId, error, lastReadId });
    });
  };
}
