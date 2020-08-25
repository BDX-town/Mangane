import api from '../api';
import { importFetchedChats } from 'soapbox/actions/importer';
import { getSettings, changeSetting } from 'soapbox/actions/settings';
import { Map as ImmutableMap } from 'immutable';

export const CHATS_FETCH_REQUEST = 'CHATS_FETCH_REQUEST';
export const CHATS_FETCH_SUCCESS = 'CHATS_FETCH_SUCCESS';
export const CHATS_FETCH_FAIL    = 'CHATS_FETCH_FAIL';

export function fetchChats() {
  return (dispatch, getState) => {
    dispatch({ type: CHATS_FETCH_REQUEST });
    return api(getState).get('/api/v1/pleroma/chats').then(({ data }) => {
      dispatch(importFetchedChats(data));
      dispatch({ type: CHATS_FETCH_SUCCESS, data });
    }).catch(error => {
      dispatch({ type: CHATS_FETCH_FAIL, error });
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
