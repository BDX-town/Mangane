import {
  CHAT_MESSAGES_FETCH_SUCCESS,
  CHAT_MESSAGE_SEND_SUCCESS,
} from 'soapbox/actions/chats';
import { CHAT_MESSAGES_IMPORT } from 'soapbox/actions/importer';
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

export default function chatMessageLists(state = initialState, action) {
  switch(action.type) {
  case CHAT_MESSAGES_IMPORT:
    return importMessages(state, action.chatMessages);
  case CHAT_MESSAGES_FETCH_SUCCESS:
    return updateList(state, action.chatId, action.data.map(chat => chat.id));
  case CHAT_MESSAGE_SEND_SUCCESS:
    return updateList(state, action.chatId, [action.data.id]);
  default:
    return state;
  }
};
