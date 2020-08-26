import { CHATS_IMPORT } from 'soapbox/actions/importer';
import { Map as ImmutableMap, fromJS } from 'immutable';

const importChat = (state, chat) => state.set(chat.id, fromJS(chat));

const importChats = (state, chats) =>
  state.withMutations(mutable => chats.forEach(chat => importChat(mutable, chat)));

const initialState = ImmutableMap();

export default function chats(state = initialState, action) {
  switch(action.type) {
  case CHATS_IMPORT:
    return importChats(state, action.chats);
  default:
    return state;
  }
};
