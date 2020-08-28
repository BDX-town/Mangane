import {
  ACCOUNT_IMPORT,
  ACCOUNTS_IMPORT,
  ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP,
} from '../actions/importer';
import { CHATS_FETCH_SUCCESS, CHAT_FETCH_SUCCESS } from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { normalizeAccount as normalizeAccount2 } from 'soapbox/actions/importer/normalizer';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const normalizeAccount = (state, account) => {
  const normalized = fromJS(account).deleteAll([
    'followers_count',
    'following_count',
    'statuses_count',
  ]);

  return state.set(account.id, normalized);
};

const normalizeAccounts = (state, accounts) => {
  accounts.forEach(account => {
    state = normalizeAccount(state, account);
  });

  return state;
};

const importAccountFromChat = (state, chat) =>
  // TODO: Fix this monstrosity
  normalizeAccount(state, normalizeAccount2(chat.account));

const importAccountsFromChats = (state, chats) =>
  state.withMutations(mutable =>
    chats.forEach(chat => importAccountFromChat(mutable, chat)));

export default function accounts(state = initialState, action) {
  switch(action.type) {
  case ACCOUNT_IMPORT:
    return normalizeAccount(state, action.account);
  case ACCOUNTS_IMPORT:
    return normalizeAccounts(state, action.accounts);
  case ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP:
    return state.set(-1, ImmutableMap({
      username: action.username,
    }));
  case CHATS_FETCH_SUCCESS:
    return importAccountsFromChats(state, action.chats);
  case CHAT_FETCH_SUCCESS:
  case STREAMING_CHAT_UPDATE:
    return importAccountsFromChats(state, [action.chat]);
  default:
    return state;
  }
};
