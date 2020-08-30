import {
  CHATS_FETCH_SUCCESS,
  CHAT_MESSAGES_FETCH_SUCCESS,
  CHAT_MESSAGE_SEND_REQUEST,
  CHAT_MESSAGE_SEND_SUCCESS,
} from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

const initialState = ImmutableMap();

const updateList = (state, chatId, messageIds) => {
  const ids = state.get(chatId, ImmutableOrderedSet());
  const newIds = ids.union(messageIds);
  return state.set(chatId, newIds);
};

const importMessage = (state, chatMessage) => {
  return updateList(state, chatMessage.chat_id, [chatMessage.id]);
};

const importMessages = (state, chatMessages) => (
  state.withMutations(map =>
    chatMessages.forEach(chatMessage =>
      importMessage(map, chatMessage)))
);

const importLastMessages = (state, chats) =>
  state.withMutations(mutable =>
    chats.forEach(chat => {
      if (chat.last_message) importMessage(mutable, chat.last_message);
    }));

export default function chatMessageLists(state = initialState, action) {
  switch(action.type) {
  case CHAT_MESSAGE_SEND_REQUEST:
    return updateList(state, action.chatId, [action.uuid]).sort();
  case CHATS_FETCH_SUCCESS:
    return importLastMessages(state, action.chats).sort();
  case STREAMING_CHAT_UPDATE:
    if (action.chat.last_message &&
        action.chat.last_message.account_id !== action.me)
      return importMessages(state, [action.chat.last_message]).sort();
    else
      return state;
  case CHAT_MESSAGES_FETCH_SUCCESS:
    return updateList(state, action.chatId, action.chatMessages.map(chat => chat.id).reverse()).sort();
  case CHAT_MESSAGE_SEND_SUCCESS:
    return updateList(state, action.chatId, [action.chatMessage.id]).sort();
  default:
    return state;
  }
};
