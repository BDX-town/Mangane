import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  CHATS_FETCH_SUCCESS,
  CHATS_FETCH_REQUEST,
  CHATS_EXPAND_SUCCESS,
  CHATS_EXPAND_REQUEST,
  CHAT_FETCH_SUCCESS,
  CHAT_READ_SUCCESS,
  CHAT_READ_REQUEST,
} from 'soapbox/actions/chats';
import { normalizeChat } from 'soapbox/actions/importer/normalizer';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';

const importChat = (state, chat) => state.setIn(['items', chat.id], fromJS(normalizeChat(chat)));

const importChats = (state, chats, next) =>
  state.withMutations(mutable => {
    if (next !== undefined) mutable.set('next', next);
    chats.forEach(chat => importChat(mutable, chat));
    mutable.set('loading', false);
  });

const initialState = ImmutableMap({
  next: null,
  isLoading: false,
  items: ImmutableMap({}),
});

export default function chats(state = initialState, action) {
  switch(action.type) {
  case CHATS_FETCH_REQUEST:
  case CHATS_EXPAND_REQUEST:
    return state.set('loading', true);
  case CHATS_FETCH_SUCCESS:
  case CHATS_EXPAND_SUCCESS:
    return importChats(state, action.chats, action.next);
  case STREAMING_CHAT_UPDATE:
    return importChats(state, [action.chat]);
  case CHAT_FETCH_SUCCESS:
    return importChats(state, [action.chat]);
  case CHAT_READ_REQUEST:
    return state.setIn([action.chatId, 'unread'], 0);
  case CHAT_READ_SUCCESS:
    return importChats(state, [action.chat]);
  default:
    return state;
  }
}
