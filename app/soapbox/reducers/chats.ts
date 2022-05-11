import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';

import {
  CHATS_FETCH_SUCCESS,
  CHATS_FETCH_REQUEST,
  CHATS_EXPAND_SUCCESS,
  CHATS_EXPAND_REQUEST,
  CHAT_FETCH_SUCCESS,
  CHAT_READ_SUCCESS,
  CHAT_READ_REQUEST,
} from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { normalizeChat } from 'soapbox/normalizers';
import { normalizeId } from 'soapbox/utils/normalizers';

import type { AnyAction } from 'redux';

type ChatRecord = ReturnType<typeof normalizeChat>;
type APIEntity = Record<string, any>;
type APIEntities = Array<APIEntity>;

export interface ReducerChat extends ChatRecord {
  account: string | null,
  last_message: string | null,
}

const ReducerRecord = ImmutableRecord({
  next: null as string | null,
  isLoading: false,
  items: ImmutableMap<ReducerChat>({}),
});

type State = ReturnType<typeof ReducerRecord>;

const minifyChat = (chat: ChatRecord): ReducerChat => {
  return chat.mergeWith((o, n) => n || o, {
    account: normalizeId(chat.getIn(['account', 'id'])),
    last_message: normalizeId(chat.getIn(['last_message', 'id'])),
  }) as ReducerChat;
};

const fixChat = (chat: APIEntity): ReducerChat => {
  return normalizeChat(chat).withMutations(chat => {
    minifyChat(chat);
  }) as ReducerChat;
};

const importChat = (state: State, chat: APIEntity) => state.setIn(['items', chat.id], fixChat(chat));

const importChats = (state: State, chats: APIEntities, next?: string) =>
  state.withMutations(mutable => {
    if (next !== undefined) mutable.set('next', next);
    chats.forEach(chat => importChat(mutable, chat));
    mutable.set('isLoading', false);
  });

export default function chats(state: State = ReducerRecord(), action: AnyAction): State {
  switch (action.type) {
    case CHATS_FETCH_REQUEST:
    case CHATS_EXPAND_REQUEST:
      return state.set('isLoading', true);
    case CHATS_FETCH_SUCCESS:
    case CHATS_EXPAND_SUCCESS:
      return importChats(state, action.chats, action.next);
    case STREAMING_CHAT_UPDATE:
      return importChats(state, [action.chat]);
    case CHAT_FETCH_SUCCESS:
      return importChats(state, [action.chat]);
    case CHAT_READ_REQUEST:
      return state.setIn([action.chatId, 'unread'], 0);
    case CHAT_READ_SUCCESS:
      return importChats(state, [action.chat]);
    default:
      return state;
  }
}
