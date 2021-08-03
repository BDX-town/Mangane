import {
  CHATS_FETCH_SUCCESS,
  CHAT_MESSAGES_FETCH_SUCCESS,
  CHAT_MESSAGE_SEND_REQUEST,
  CHAT_MESSAGE_SEND_SUCCESS,
  CHAT_MESSAGE_DELETE_SUCCESS,
} from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

const initialState = ImmutableMap();

const idComparator = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

const updateList = (state, chatId, messageIds) => {
  const ids = state.get(chatId, ImmutableOrderedSet());
  const newIds = ids.union(messageIds).sort(idComparator);
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

const replaceMessage = (state, chatId, oldId, newId) => {
  return state.update(chatId, chat => chat.delete(oldId).add(newId).sort(idComparator));
};

export default function chatMessageLists(state = initialState, action) {
  switch(action.type) {
  case CHAT_MESSAGE_SEND_REQUEST:
    return updateList(state, action.chatId, [action.uuid]);
  case CHATS_FETCH_SUCCESS:
    return importLastMessages(state, action.chats);
  case STREAMING_CHAT_UPDATE:
    if (action.chat.last_message &&
        action.chat.last_message.account_id !== action.me)
      return importMessages(state, [action.chat.last_message]);
    else
      return state;
  case CHAT_MESSAGES_FETCH_SUCCESS:
    return updateList(state, action.chatId, action.chatMessages.map(chat => chat.id));
  case CHAT_MESSAGE_SEND_SUCCESS:
    return replaceMessage(state, action.chatId, action.uuid, action.chatMessage.id);
  case CHAT_MESSAGE_DELETE_SUCCESS:
    return state.update(action.chatId, chat => chat.delete(action.messageId));
  default:
    return state;
  }
}
