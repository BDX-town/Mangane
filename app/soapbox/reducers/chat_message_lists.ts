import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';
import { AnyAction } from 'redux';

import {
  CHATS_FETCH_SUCCESS,
  CHATS_EXPAND_SUCCESS,
  CHAT_MESSAGES_FETCH_SUCCESS,
  CHAT_MESSAGE_SEND_REQUEST,
  CHAT_MESSAGE_SEND_SUCCESS,
  CHAT_MESSAGE_DELETE_SUCCESS,
} from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';

type APIEntity = Record<string, any>;
type APIEntities = Array<APIEntity>;

type State = ImmutableMap<string, ImmutableOrderedSet<string>>;

const initialState: State = ImmutableMap();

const idComparator = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

const updateList = (state: State, chatId: string, messageIds: string[]) => {
  const ids = state.get(chatId, ImmutableOrderedSet());
  const newIds = (ids.union(messageIds) as ImmutableOrderedSet<string>).sort(idComparator);
  return state.set(chatId, newIds);
};

const importMessage = (state: State, chatMessage: APIEntity) => {
  return updateList(state, chatMessage.chat_id, [chatMessage.id]);
};

const importMessages = (state: State, chatMessages: APIEntities) => (
  state.withMutations(map =>
    chatMessages.forEach(chatMessage =>
      importMessage(map, chatMessage)))
);

const importLastMessages = (state: State, chats: APIEntities) =>
  state.withMutations(mutable =>
    chats.forEach(chat => {
      if (chat.last_message) importMessage(mutable, chat.last_message);
    }));

const replaceMessage = (state: State, chatId: string, oldId: string, newId: string) => {
  return state.update(chatId, chat => chat!.delete(oldId).add(newId).sort(idComparator));
};

export default function chatMessageLists(state = initialState, action: AnyAction) {
  switch (action.type) {
    case CHAT_MESSAGE_SEND_REQUEST:
      return updateList(state, action.chatId, [action.uuid]);
    case CHATS_FETCH_SUCCESS:
    case CHATS_EXPAND_SUCCESS:
      return importLastMessages(state, action.chats);
    case STREAMING_CHAT_UPDATE:
      if (action.chat.last_message &&
        action.chat.last_message.account_id !== action.me)
        return importMessages(state, [action.chat.last_message]);
      else
        return state;
    case CHAT_MESSAGES_FETCH_SUCCESS:
      return updateList(state, action.chatId, action.chatMessages.map((chat: APIEntity) => chat.id));
    case CHAT_MESSAGE_SEND_SUCCESS:
      return replaceMessage(state, action.chatId, action.uuid, action.chatMessage.id);
    case CHAT_MESSAGE_DELETE_SUCCESS:
      return state.update(action.chatId, chat => chat!.delete(action.messageId));
    default:
      return state;
  }
}
