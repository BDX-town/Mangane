import {
  CHAT_MESSAGES_FETCH_SUCCESS,
  CHAT_MESSAGE_SEND_SUCCESS,
} from 'soapbox/actions/chats';
import { CHAT_IMPORT, CHATS_IMPORT } from 'soapbox/actions/importer';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap();

const insertMessage = (state, chatId, message) => {
  const newMessages = state.get(chatId, ImmutableList()).insert(0, message);
  return state.set(chatId, newMessages);
};

const importMessage = (state, message) => {
  const chatId = message.get('chat_id');
  return insertMessage(state, chatId, message);
};

const importLastMessages = (state, chats) =>
  state.withMutations(mutable =>
    chats.forEach(chat => importMessage(mutable, chat.get('last_message'))));

export default function chatMessages(state = initialState, action) {
  switch(action.type) {
  case CHAT_IMPORT:
    return importMessage(state, fromJS(action.chat.last_message));
  case CHATS_IMPORT:
    return importLastMessages(state, fromJS(action.chats));
  case CHAT_MESSAGES_FETCH_SUCCESS:
    return state.set(action.chatId, fromJS(action.data));
  // TODO: Prevent conflicts
  // case CHAT_MESSAGE_SEND_SUCCESS:
  //   return insertMessage(state, action.chatId, fromJS(action.data));
  default:
    return state;
  }
};
