import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import { v4 as uuidv4 } from 'uuid';

import { getSettings, changeSetting } from 'soapbox/actions/settings';
import { getFeatures } from 'soapbox/utils/features';

import api, { getLinks } from '../api';

import type { History } from 'history';
import type { AppDispatch, RootState } from 'soapbox/store';

const CHATS_FETCH_REQUEST = 'CHATS_FETCH_REQUEST';
const CHATS_FETCH_SUCCESS = 'CHATS_FETCH_SUCCESS';
const CHATS_FETCH_FAIL    = 'CHATS_FETCH_FAIL';

const CHATS_EXPAND_REQUEST = 'CHATS_EXPAND_REQUEST';
const CHATS_EXPAND_SUCCESS = 'CHATS_EXPAND_SUCCESS';
const CHATS_EXPAND_FAIL    = 'CHATS_EXPAND_FAIL';

const CHAT_MESSAGES_FETCH_REQUEST = 'CHAT_MESSAGES_FETCH_REQUEST';
const CHAT_MESSAGES_FETCH_SUCCESS = 'CHAT_MESSAGES_FETCH_SUCCESS';
const CHAT_MESSAGES_FETCH_FAIL    = 'CHAT_MESSAGES_FETCH_FAIL';

const CHAT_MESSAGE_SEND_REQUEST = 'CHAT_MESSAGE_SEND_REQUEST';
const CHAT_MESSAGE_SEND_SUCCESS = 'CHAT_MESSAGE_SEND_SUCCESS';
const CHAT_MESSAGE_SEND_FAIL    = 'CHAT_MESSAGE_SEND_FAIL';

const CHAT_FETCH_REQUEST = 'CHAT_FETCH_REQUEST';
const CHAT_FETCH_SUCCESS = 'CHAT_FETCH_SUCCESS';
const CHAT_FETCH_FAIL    = 'CHAT_FETCH_FAIL';

const CHAT_READ_REQUEST = 'CHAT_READ_REQUEST';
const CHAT_READ_SUCCESS = 'CHAT_READ_SUCCESS';
const CHAT_READ_FAIL    = 'CHAT_READ_FAIL';

const CHAT_MESSAGE_DELETE_REQUEST = 'CHAT_MESSAGE_DELETE_REQUEST';
const CHAT_MESSAGE_DELETE_SUCCESS = 'CHAT_MESSAGE_DELETE_SUCCESS';
const CHAT_MESSAGE_DELETE_FAIL    = 'CHAT_MESSAGE_DELETE_FAIL';

const fetchChatsV1 = () =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    api(getState).get('/api/v1/pleroma/chats').then((response) => {
      dispatch({ type: CHATS_FETCH_SUCCESS, chats: response.data });
    }).catch(error => {
      dispatch({ type: CHATS_FETCH_FAIL, error });
    });

const fetchChatsV2 = () =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    api(getState).get('/api/v2/pleroma/chats').then((response) => {
      let next: { uri: string } | undefined = getLinks(response).refs.find(link => link.rel === 'next');

      if (!next && response.data.length) {
        next = { uri: `/api/v2/pleroma/chats?max_id=${response.data[response.data.length - 1].id}&offset=0` };
      }

      dispatch({ type: CHATS_FETCH_SUCCESS, chats: response.data, next: next ? next.uri : null });
    }).catch(error => {
      dispatch({ type: CHATS_FETCH_FAIL, error });
    });

const fetchChats = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { instance } = state;
    const features = getFeatures(instance);

    dispatch({ type: CHATS_FETCH_REQUEST });
    if (features.chatsV2) {
      return dispatch(fetchChatsV2());
    } else {
      return dispatch(fetchChatsV1());
    }
  };

const expandChats = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const url = getState().chats.next;

    if (url === null) {
      return;
    }

    dispatch({ type: CHATS_EXPAND_REQUEST });
    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch({ type: CHATS_EXPAND_SUCCESS, chats: response.data, next: next ? next.uri : null });
    }).catch(error => {
      dispatch({ type: CHATS_EXPAND_FAIL, error });
    });
  };

const fetchChatMessages = (chatId: string, maxId: string | null = null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: CHAT_MESSAGES_FETCH_REQUEST, chatId, maxId });
    return api(getState).get(`/api/v1/pleroma/chats/${chatId}/messages`, { params: { max_id: maxId } }).then(({ data }) => {
      dispatch({ type: CHAT_MESSAGES_FETCH_SUCCESS, chatId, maxId, chatMessages: data });
    }).catch(error => {
      dispatch({ type: CHAT_MESSAGES_FETCH_FAIL, chatId, maxId, error });
    });
  };

const sendChatMessage = (chatId: string, params: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const uuid = `末_${Date.now()}_${uuidv4()}`;
    const me = getState().me;
    dispatch({ type: CHAT_MESSAGE_SEND_REQUEST, chatId, params, uuid, me });
    return api(getState).post(`/api/v1/pleroma/chats/${chatId}/messages`, params).then(({ data }) => {
      dispatch({ type: CHAT_MESSAGE_SEND_SUCCESS, chatId, chatMessage: data, uuid });
    }).catch(error => {
      dispatch({ type: CHAT_MESSAGE_SEND_FAIL, chatId, error, uuid });
    });
  };

const openChat = (chatId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const panes = getSettings(state).getIn(['chats', 'panes']) as ImmutableList<ImmutableMap<string, any>>;
    const idx = panes.findIndex(pane => pane.get('chat_id') === chatId);

    dispatch(markChatRead(chatId));

    if (idx > -1) {
      return dispatch(changeSetting(['chats', 'panes', idx as any, 'state'], 'open'));
    } else {
      const newPane = ImmutableMap({ chat_id: chatId, state: 'open' });
      return dispatch(changeSetting(['chats', 'panes'], panes.push(newPane)));
    }
  };

const closeChat = (chatId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const panes = getSettings(getState()).getIn(['chats', 'panes']) as ImmutableList<ImmutableMap<string, any>>;
    const idx = panes.findIndex(pane => pane.get('chat_id') === chatId);

    if (idx > -1) {
      return dispatch(changeSetting(['chats', 'panes'], panes.delete(idx)));
    } else {
      return false;
    }
  };

const toggleChat = (chatId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const panes = getSettings(getState()).getIn(['chats', 'panes']) as ImmutableList<ImmutableMap<string, any>>;
    const [idx, pane] = panes.findEntry(pane => pane.get('chat_id') === chatId)!;

    if (idx > -1) {
      const state = pane.get('state') === 'minimized' ? 'open' : 'minimized';
      if (state === 'open') dispatch(markChatRead(chatId));
      return dispatch(changeSetting(['chats', 'panes', idx as any, 'state'], state));
    } else {
      return false;
    }
  };

const toggleMainWindow = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const main = getSettings(getState()).getIn(['chats', 'mainWindow']) as 'minimized' | 'open';
    const state = main === 'minimized' ? 'open' : 'minimized';
    return dispatch(changeSetting(['chats', 'mainWindow'], state));
  };

const fetchChat = (chatId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: CHAT_FETCH_REQUEST, chatId });
    return api(getState).get(`/api/v1/pleroma/chats/${chatId}`).then(({ data }) => {
      dispatch({ type: CHAT_FETCH_SUCCESS, chat: data });
    }).catch(error => {
      dispatch({ type: CHAT_FETCH_FAIL, chatId, error });
    });
  };

const startChat = (accountId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: CHAT_FETCH_REQUEST, accountId });
    return api(getState).post(`/api/v1/pleroma/chats/by-account-id/${accountId}`).then(({ data }) => {
      dispatch({ type: CHAT_FETCH_SUCCESS, chat: data });
      return data;
    }).catch(error => {
      dispatch({ type: CHAT_FETCH_FAIL, accountId, error });
    });
  };

const markChatRead = (chatId: string, lastReadId?: string | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const chat = getState().chats.items.get(chatId)!;
    if (!lastReadId) lastReadId = chat.last_message;

    if (chat.get('unread') < 1) return;
    if (!lastReadId) return;

    dispatch({ type: CHAT_READ_REQUEST, chatId, lastReadId });
    api(getState).post(`/api/v1/pleroma/chats/${chatId}/read`, { last_read_id: lastReadId }).then(({ data }) => {
      dispatch({ type: CHAT_READ_SUCCESS, chat: data, lastReadId });
    }).catch(error => {
      dispatch({ type: CHAT_READ_FAIL, chatId, error, lastReadId });
    });
  };

const deleteChatMessage = (chatId: string, messageId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: CHAT_MESSAGE_DELETE_REQUEST, chatId, messageId });
    api(getState).delete(`/api/v1/pleroma/chats/${chatId}/messages/${messageId}`).then(({ data }) => {
      dispatch({ type: CHAT_MESSAGE_DELETE_SUCCESS, chatId, messageId, chatMessage: data });
    }).catch(error => {
      dispatch({ type: CHAT_MESSAGE_DELETE_FAIL, chatId, messageId, error });
    });
  };

/** Start a chat and launch it in the UI */
const launchChat = (accountId: string, router: History, forceNavigate = false) => {
  const isMobile = (width: number) => width <= 1190;

  return (dispatch: AppDispatch) => {
    // TODO: make this faster
    return dispatch(startChat(accountId)).then(chat => {
      if (forceNavigate || isMobile(window.innerWidth)) {
        router.push(`/chats/${chat.id}`);
      } else {
        dispatch(openChat(chat.id));
      }
    });
  };
};

export {
  CHATS_FETCH_REQUEST,
  CHATS_FETCH_SUCCESS,
  CHATS_FETCH_FAIL,
  CHATS_EXPAND_REQUEST,
  CHATS_EXPAND_SUCCESS,
  CHATS_EXPAND_FAIL,
  CHAT_MESSAGES_FETCH_REQUEST,
  CHAT_MESSAGES_FETCH_SUCCESS,
  CHAT_MESSAGES_FETCH_FAIL,
  CHAT_MESSAGE_SEND_REQUEST,
  CHAT_MESSAGE_SEND_SUCCESS,
  CHAT_MESSAGE_SEND_FAIL,
  CHAT_FETCH_REQUEST,
  CHAT_FETCH_SUCCESS,
  CHAT_FETCH_FAIL,
  CHAT_READ_REQUEST,
  CHAT_READ_SUCCESS,
  CHAT_READ_FAIL,
  CHAT_MESSAGE_DELETE_REQUEST,
  CHAT_MESSAGE_DELETE_SUCCESS,
  CHAT_MESSAGE_DELETE_FAIL,
  fetchChatsV1,
  fetchChatsV2,
  fetchChats,
  expandChats,
  fetchChatMessages,
  sendChatMessage,
  openChat,
  closeChat,
  toggleChat,
  toggleMainWindow,
  fetchChat,
  startChat,
  markChatRead,
  deleteChatMessage,
  launchChat,
};
