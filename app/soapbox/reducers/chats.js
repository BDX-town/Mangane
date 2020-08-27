import { CHATS_FETCH_SUCCESS, CHAT_FETCH_SUCCESS } from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { normalizeChat } from 'soapbox/actions/importer/normalizer';
import { Map as ImmutableMap, fromJS } from 'immutable';

const importChat = (state, chat) => state.set(chat.id, fromJS(normalizeChat(chat)));

const importChats = (state, chats) =>
  state.withMutations(mutable => chats.forEach(chat => importChat(mutable, chat)));

const chatDateComparator = (chatA, chatB) => {
  // Sort most recently updated chats at the top
  const a = new Date(chatA.get('updated_at'));
  const b = new Date(chatB.get('updated_at'));

  if (a === b) return 0;
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

const initialState = ImmutableMap();

export default function chats(state = initialState, action) {
  switch(action.type) {
  case CHATS_FETCH_SUCCESS:
    return importChats(state, action.chats).sort(chatDateComparator);
  case STREAMING_CHAT_UPDATE:
    return importChats(state, [action.chat]).sort(chatDateComparator);
  case CHAT_FETCH_SUCCESS:
    return importChats(state, [action.chat]).sort(chatDateComparator);
  default:
    return state;
  }
};
