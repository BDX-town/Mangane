import { CHAT_MESSAGES_FETCH_SUCCESS } from 'soapbox/actions/chats';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function chatMessages(state = initialState, action) {
  switch(action.type) {
  case CHAT_MESSAGES_FETCH_SUCCESS:
    return state.set(action.chatId, fromJS(action.data));
  default:
    return state;
  }
};
