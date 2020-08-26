import { CHATS_FETCH_SUCCESS } from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { normalizeChat } from 'soapbox/actions/importer/normalizer';
import { Map as ImmutableMap, fromJS } from 'immutable';

const importChat = (state, chat) => state.set(chat.id, fromJS(normalizeChat(chat)));

const importChats = (state, chats) =>
  state.withMutations(mutable => chats.forEach(chat => importChat(mutable, chat)));

const initialState = ImmutableMap();

export default function chats(state = initialState, action) {
  switch(action.type) {
  case CHATS_FETCH_SUCCESS:
    return importChats(state, action.data);
  case STREAMING_CHAT_UPDATE:
    return importChats(state, [action.payload]);
  default:
    return state;
  }
};
