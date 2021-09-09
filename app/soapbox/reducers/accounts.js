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
  ADMIN_USERS_FETCH_SUCCESS,
  ADMIN_USERS_TAG_REQUEST,
  ADMIN_USERS_TAG_SUCCESS,
  ADMIN_USERS_TAG_FAIL,
  ADMIN_USERS_UNTAG_REQUEST,
  ADMIN_USERS_UNTAG_SUCCESS,
  ADMIN_USERS_UNTAG_FAIL,
  ADMIN_ADD_PERMISSION_GROUP_REQUEST,
  ADMIN_ADD_PERMISSION_GROUP_SUCCESS,
  ADMIN_ADD_PERMISSION_GROUP_FAIL,
  ADMIN_REMOVE_PERMISSION_GROUP_REQUEST,
  ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS,
  ADMIN_REMOVE_PERMISSION_GROUP_FAIL,
  ADMIN_USERS_DELETE_REQUEST,
  ADMIN_USERS_DELETE_FAIL,
  ADMIN_USERS_DEACTIVATE_REQUEST,
  ADMIN_USERS_DEACTIVATE_FAIL,
} from 'soapbox/actions/admin';

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
    'source',
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

const setActive = (state, accountIds, active) => {
  return state.withMutations(state => {
    accountIds.forEach(id => {
      state.setIn([id, 'pleroma', 'is_active'], active);
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

const buildAccount = adminUser => fromJS({
  id: adminUser.get('id'),
  username: adminUser.get('nickname').split('@')[0],
  acct: adminUser.get('nickname'),
  display_name: adminUser.get('display_name'),
  display_name_html: adminUser.get('display_name'),
  note: '',
  url: adminUser.get('url'),
  avatar: adminUser.get('avatar'),
  avatar_static: adminUser.get('avatar'),
  header: '',
  header_static: '',
  emojis: [],
  fields: [],
  created_at: adminUser.get('created_at'),
  pleroma: {
    is_active: adminUser.get('is_active'),
    is_confirmed: adminUser.get('is_confirmed'),
    is_admin: adminUser.getIn(['roles', 'admin']),
    is_moderator: adminUser.getIn(['roles', 'moderator']),
    tags: adminUser.get('tags'),
  },
  source: {
    pleroma: {
      actor_type: adminUser.get('actor_type'),
    },
  },
  should_refetch: true,
});

const mergeAdminUser = (account, adminUser) => {
  return account.withMutations(account => {
    account.set('display_name', adminUser.get('display_name'));
    account.set('avatar', adminUser.get('avatar'));
    account.set('avatar_static', adminUser.get('avatar'));
    account.setIn(['pleroma', 'is_active'], adminUser.get('is_active'));
    account.setIn(['pleroma', 'is_admin'], adminUser.getIn(['roles', 'admin']));
    account.setIn(['pleroma', 'is_moderator'], adminUser.getIn(['roles', 'moderator']));
    account.setIn(['pleroma', 'is_confirmed'], adminUser.get('is_confirmed'));
    account.setIn(['pleroma', 'tags'], adminUser.get('tags'));
  });
};

const importAdminUser = (state, adminUser) => {
  const id = adminUser.get('id');
  const account = state.get(id);

  if (!account) {
    return state.set(id, buildAccount(adminUser));
  } else {
    return state.set(id, mergeAdminUser(account, adminUser));
  }
};

const importAdminUsers = (state, adminUsers) => {
  return state.withMutations(state => {
    fromJS(adminUsers).forEach(adminUser => {
      importAdminUser(state, adminUser);
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
  case ADMIN_USERS_TAG_SUCCESS:
  case ADMIN_USERS_UNTAG_FAIL:
    return addTags(state, action.accountIds, action.tags);
  case ADMIN_USERS_UNTAG_REQUEST:
  case ADMIN_USERS_UNTAG_SUCCESS:
  case ADMIN_USERS_TAG_FAIL:
    return removeTags(state, action.accountIds, action.tags);
  case ADMIN_ADD_PERMISSION_GROUP_REQUEST:
  case ADMIN_ADD_PERMISSION_GROUP_SUCCESS:
  case ADMIN_REMOVE_PERMISSION_GROUP_FAIL:
    return addPermission(state, action.accountIds, action.permissionGroup);
  case ADMIN_REMOVE_PERMISSION_GROUP_REQUEST:
  case ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS:
  case ADMIN_ADD_PERMISSION_GROUP_FAIL:
    return removePermission(state, action.accountIds, action.permissionGroup);
  case ADMIN_USERS_DELETE_REQUEST:
  case ADMIN_USERS_DEACTIVATE_REQUEST:
    return setActive(state, action.accountIds, false);
  case ADMIN_USERS_DELETE_FAIL:
  case ADMIN_USERS_DEACTIVATE_FAIL:
    return setActive(state, action.accountIds, true);
  case ADMIN_USERS_FETCH_SUCCESS:
    return importAdminUsers(state, action.users);
  default:
    return state;
  }
}
