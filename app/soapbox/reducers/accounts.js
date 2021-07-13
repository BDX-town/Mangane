import {
  ACCOUNT_IMPORT,
  ACCOUNTS_IMPORT,
  ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP,
} from '../actions/importer';
import { CHATS_FETCH_SUCCESS, CHAT_FETCH_SUCCESS } from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { normalizeAccount as normalizeAccount2 } from 'soapbox/actions/importer/normalizer';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable';
import { normalizePleromaUserFields } from 'soapbox/utils/pleroma';
import {
  ADMIN_USERS_TAG_REQUEST,
  ADMIN_USERS_TAG_FAIL,
  ADMIN_USERS_UNTAG_REQUEST,
  ADMIN_USERS_UNTAG_FAIL,
  ADMIN_ADD_PERMISSION_REQUEST,
  ADMIN_ADD_PERMISSION_FAIL,
  ADMIN_REMOVE_PERMISSION_REQUEST,
  ADMIN_REMOVE_PERMISSION_FAIL,
} from 'soapbox/actions/admin';
import { ADMIN_USERS_DELETE_REQUEST } from 'soapbox/actions/admin';

const initialState = ImmutableMap();

const normalizePleroma = account => {
  if (!account.pleroma) return account;
  account.pleroma = normalizePleromaUserFields(account.pleroma);
  delete account.pleroma.chat_token;
  return account;
};

const normalizeAccount = (state, account) => {
  const normalized = fromJS(normalizePleroma(account)).deleteAll([
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

const addTags = (state, accountIds, tags) => {
  return state.withMutations(state => {
    accountIds.forEach(id => {
      state.updateIn([id, 'pleroma', 'tags'], ImmutableList(), v =>
        v.toOrderedSet().union(tags).toList(),
      );
    });
  });
};

const removeTags = (state, accountIds, tags) => {
  return state.withMutations(state => {
    accountIds.forEach(id => {
      state.updateIn([id, 'pleroma', 'tags'], ImmutableList(), v =>
        v.toOrderedSet().subtract(tags).toList(),
      );
    });
  });
};

const nicknamesToIds = (state, nicknames) => {
  return nicknames.map(nickname => {
    return state.find(account => account.get('acct') === nickname, null, ImmutableMap()).get('id');
  });
};

const setDeactivated = (state, nicknames) => {
  const ids = nicknamesToIds(state, nicknames);
  return state.withMutations(state => {
    ids.forEach(id => {
      state.setIn([id, 'pleroma', 'is_active'], false);
    });
  });
};

const permissionGroupFields = {
  admin: 'is_admin',
  moderator: 'is_moderator',
};

const addPermission = (state, accountIds, permissionGroup) => {
  const field = permissionGroupFields[permissionGroup];
  if (!field) return state;

  return state.withMutations(state => {
    accountIds.forEach(id => {
      state.setIn([id, 'pleroma', field], true);
    });
  });
};

const removePermission = (state, accountIds, permissionGroup) => {
  const field = permissionGroupFields[permissionGroup];
  if (!field) return state;

  return state.withMutations(state => {
    accountIds.forEach(id => {
      state.setIn([id, 'pleroma', field], false);
    });
  });
};

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
  case ADMIN_USERS_TAG_REQUEST:
  case ADMIN_USERS_UNTAG_FAIL:
    return addTags(state, action.accountIds, action.tags);
  case ADMIN_USERS_UNTAG_REQUEST:
  case ADMIN_USERS_TAG_FAIL:
    return removeTags(state, action.accountIds, action.tags);
  case ADMIN_ADD_PERMISSION_REQUEST:
  case ADMIN_REMOVE_PERMISSION_FAIL:
    return addPermission(state, action.accountIds, action.permissionGroup);
  case ADMIN_REMOVE_PERMISSION_REQUEST:
  case ADMIN_ADD_PERMISSION_FAIL:
    return removePermission(state, action.accountIds, action.permissionGroup);
  case ADMIN_USERS_DELETE_REQUEST:
    return setDeactivated(state, action.nicknames);
  default:
    return state;
  }
};
