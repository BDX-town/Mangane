import {
  CHATS_FETCH_SUCCESS,
  CHAT_MESSAGES_FETCH_SUCCESS,
  CHAT_MESSAGE_SEND_SUCCESS,
} from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const importMessage = (state, message) => {
  return state.set(message.get('id'), message);
};

const importMessages = (state, messages) =>
  state.withMutations(mutable =>
    messages.forEach(message => importMessage(mutable, message)));

const importLastMessages = (state, chats) =>
  state.withMutations(mutable =>
    chats.forEach(chat => importMessage(mutable, chat.get('last_message'))));

export default function chatMessages(state = initialState, action) {
  switch(action.type) {
  case CHATS_FETCH_SUCCESS:
    return importLastMessages(state, fromJS(action.data));
  case CHAT_MESSAGES_FETCH_SUCCESS:
    return importMessages(state, fromJS(action.data));
  case CHAT_MESSAGE_SEND_SUCCESS:
    return importMessage(state, fromJS(action.data));
  case STREAMING_CHAT_UPDATE:
    return importLastMessages(state, fromJS([action.payload]));
  default:
    return state;
  }
};
