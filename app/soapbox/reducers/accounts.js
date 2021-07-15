import {
  ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP,
} from 'soapbox/actions/importer';
import {
  ACCOUNT_FETCH_SUCCESS,
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
} from 'soapbox/actions/accounts';
import {
  VERIFY_CREDENTIALS_SUCCESS,
} from 'soapbox/actions/auth';
import {
  ME_FETCH_SUCCESS,
  ME_PATCH_SUCCESS,
} from 'soapbox/actions/me';
import {
  BLOCKS_FETCH_SUCCESS,
  BLOCKS_EXPAND_SUCCESS,
} from 'soapbox/actions/blocks';
import {
  MUTES_FETCH_SUCCESS,
  MUTES_EXPAND_SUCCESS,
} from 'soapbox/actions/mutes';
import {
  COMPOSE_SUGGESTIONS_READY,
} from 'soapbox/actions/compose';
import {
  REBLOG_SUCCESS,
  UNREBLOG_SUCCESS,
  FAVOURITE_SUCCESS,
  UNFAVOURITE_SUCCESS,
  REBLOGS_FETCH_SUCCESS,
  FAVOURITES_FETCH_SUCCESS,
  BOOKMARK_SUCCESS,
  UNBOOKMARK_SUCCESS,
} from 'soapbox/actions/interactions';
import {
  TIMELINE_REFRESH_SUCCESS,
  TIMELINE_EXPAND_SUCCESS,
} from 'soapbox/actions/timelines';
import {
  STATUS_FETCH_SUCCESS,
  CONTEXT_FETCH_SUCCESS,
} from 'soapbox/actions/statuses';
import { SEARCH_FETCH_SUCCESS } from 'soapbox/actions/search';
import {
  CONVERSATIONS_FETCH_SUCCESS,
  CONVERSATIONS_UPDATE,
} from 'soapbox/actions/conversations';
import {
  NOTIFICATIONS_UPDATE,
  NOTIFICATIONS_REFRESH_SUCCESS,
  NOTIFICATIONS_EXPAND_SUCCESS,
} from 'soapbox/actions/notifications';
import {
  FAVOURITED_STATUSES_FETCH_SUCCESS,
  FAVOURITED_STATUSES_EXPAND_SUCCESS,
} from 'soapbox/actions/favourites';
import {
  LIST_ACCOUNTS_FETCH_SUCCESS,
  LIST_EDITOR_SUGGESTIONS_READY,
} from 'soapbox/actions/lists';
import {
  SUGGESTIONS_FETCH_SUCCESS,
} from 'soapbox/actions/suggestions';
import {
  CHATS_FETCH_SUCCESS,
  CHAT_FETCH_SUCCESS,
} from 'soapbox/actions/chats';
import {
  EMOJI_REACTS_FETCH_SUCCESS,
} from 'soapbox/actions/emoji_reacts';
import {
  GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  GROUP_MEMBERS_FETCH_SUCCESS,
  GROUP_MEMBERS_EXPAND_SUCCESS,
} from 'soapbox/actions/groups';
import {
  STREAMING_NOTIFICATION_UPDATE,
  STREAMING_CHAT_UPDATE,
  STREAMING_TIMELINE_UPDATE,
} from 'soapbox/actions/streaming';
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
  ADMIN_REPORTS_FETCH_SUCCESS,
} from 'soapbox/actions/admin';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable';
import { normalizePleromaUserFields } from 'soapbox/utils/pleroma';
import escapeTextContentForBrowser from 'escape-html';
import emojify from 'soapbox/features/emoji/emoji';
import { unescapeHTML } from 'soapbox/utils/html';

const initialState = ImmutableMap();

const makeEmojiMap = record => record.emojis.reduce((obj, emoji) => {
  obj[`:${emoji.shortcode}:`] = emoji;
  return obj;
}, {});

const normalizePleroma = account => {
  if (account.pleroma) {
    account.pleroma = normalizePleromaUserFields(account.pleroma);
    delete account.pleroma.chat_token;
  }
  return account;
};

const normalizeAccount = account => {
  account = { ...account };

  if (!account.id) {
    throw 'missing ID property';
  }

  const emojiMap = makeEmojiMap(account);
  const displayName = account.display_name.trim().length === 0 ? account.username : account.display_name;

  account.display_name_html = emojify(escapeTextContentForBrowser(displayName), emojiMap);
  account.note_emojified = emojify(account.note, emojiMap);

  if (account.fields) {
    account.fields = account.fields.map(pair => ({
      ...pair,
      name_emojified: emojify(escapeTextContentForBrowser(pair.name)),
      value_emojified: emojify(pair.value, emojiMap),
      value_plain: unescapeHTML(pair.value),
    }));
  }

  if (account.moved) {
    account.moved = account.moved.id;
  }

  account = normalizePleroma(account);

  return fromJS(account);
};

const importAccount = (state, account) => {
  return state.withMutations(state => {
    if (account.moved) {
      importAccount(state, account.moved);
    }

    try {
      state.set(account.id, normalizeAccount(account));
    } catch(e) {
      // Skip broken accounts
      console.warn(`Skipped broken account returned from the API: ${e}`);
      console.warn(account);
    }
  });
};

const importAccounts = (state, accounts) => {
  return state.withMutations(state => {
    accounts.forEach(account => {
      importAccount(state, account);
    });
  });
};

const importStatus = (state, status) => {
  return state.withMutations(state => {
    importAccount(state, status.account);

    if (status.reblog && status.reblog.account) {
      importAccount(state, status.reblog.account);
    }
  });
};

const importStatuses = (state, statuses) => {
  return state.withMutations(state => {
    statuses.forEach(status => importStatus(state, status));
  });
};

const importContext = (state, ancestors, descendants) => {
  return state.withMutations(state => {
    importStatuses(state, ancestors);
    importStatuses(state, descendants);
  });
};

const importNotification = (state, notification) => (
  importAccount(state, notification.account)
);

const importNotifications = (state, notifications) => {
  return state.withMutations(state => {
    notifications.forEach(notification => importNotification(state, notification));
  });
};

const importConversation = (state, conversation) => (
  importAccounts(conversation.accounts)
);

const importConversations = (state, conversations) => {
  return state.withMutations(state => {
    conversations.forEach(conversation => importConversation(state, conversation));
  });
};

const importChat = (state, chat) => importAccount(state, chat.account);

const importChats = (state, chats) => {
  return state.withMutations(state => {
    chats.forEach(chat => importChat(state, chat));
  });
};

const importEmojiReact = (state, emojiReact) => (
  importAccounts(emojiReact.accounts)
);

const importEmojiReacts = (state, emojiReacts) => {
  return state.withMutations(state => {
    emojiReacts.forEach(emojiReact => importEmojiReact(state, emojiReact));
  });
};

const importReport = (state, report) => {
  return state.withMutations(state => {
    importAccount(report.account);
    importAccount(report.actor);
  });
};

const importAdminReports = (state, reports) => {
  return state.withMutations(state => {
    reports.forEach(report => importReport(state, report));
  });
};

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
  case ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP:
    return state.set(-1, ImmutableMap({
      username: action.username,
    }));
  case ACCOUNT_FETCH_SUCCESS:
  case VERIFY_CREDENTIALS_SUCCESS:
    return importAccount(state, action.account);
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    return importAccount(state, action.me);
  case FOLLOWERS_FETCH_SUCCESS:
  case FOLLOWERS_EXPAND_SUCCESS:
  case FOLLOWING_FETCH_SUCCESS:
  case FOLLOWING_EXPAND_SUCCESS:
  case REBLOGS_FETCH_SUCCESS:
  case FAVOURITES_FETCH_SUCCESS:
  case COMPOSE_SUGGESTIONS_READY:
  case FOLLOW_REQUESTS_FETCH_SUCCESS:
  case FOLLOW_REQUESTS_EXPAND_SUCCESS:
  case BLOCKS_FETCH_SUCCESS:
  case BLOCKS_EXPAND_SUCCESS:
  case MUTES_FETCH_SUCCESS:
  case MUTES_EXPAND_SUCCESS:
  case LIST_ACCOUNTS_FETCH_SUCCESS:
  case LIST_EDITOR_SUGGESTIONS_READY:
  case SUGGESTIONS_FETCH_SUCCESS:
  case GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS:
  case GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS:
  case GROUP_MEMBERS_FETCH_SUCCESS:
  case GROUP_MEMBERS_EXPAND_SUCCESS:
    return action.accounts ? importAccounts(state, action.accounts) : state;
  case CONVERSATIONS_FETCH_SUCCESS:
    return importConversations(state, action.conversations);
  case CONVERSATIONS_UPDATE:
    return importConversation(state, action.conversation);
  case NOTIFICATIONS_REFRESH_SUCCESS:
  case NOTIFICATIONS_EXPAND_SUCCESS:
    return importNotifications(state, action.notifications);
  case NOTIFICATIONS_UPDATE:
  case STREAMING_NOTIFICATION_UPDATE:
    return importNotification(state, action.notification);
  case SEARCH_FETCH_SUCCESS:
    return importAccounts(state, action.results.accounts);
  case TIMELINE_REFRESH_SUCCESS:
  case TIMELINE_EXPAND_SUCCESS:
  case FAVOURITED_STATUSES_FETCH_SUCCESS:
  case FAVOURITED_STATUSES_EXPAND_SUCCESS:
    return importStatuses(state, action.statuses);
  case CONTEXT_FETCH_SUCCESS:
    return importContext(state, action.ancestors, action.descendants);
  case REBLOG_SUCCESS:
  case FAVOURITE_SUCCESS:
  case UNREBLOG_SUCCESS:
  case UNFAVOURITE_SUCCESS:
  case STREAMING_TIMELINE_UPDATE:
  case STATUS_FETCH_SUCCESS:
  case BOOKMARK_SUCCESS:
  case UNBOOKMARK_SUCCESS:
    return importStatus(state, action.status);
  case CHATS_FETCH_SUCCESS:
    return importChats(state, action.chats);
  case CHAT_FETCH_SUCCESS:
  case STREAMING_CHAT_UPDATE:
    return importChats(state, [action.chat]);
  case EMOJI_REACTS_FETCH_SUCCESS:
    return importEmojiReacts(state, action.emojiReacts);
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
  case ADMIN_REPORTS_FETCH_SUCCESS:
    return importAdminReports(state, action.reports);
  default:
    return state;
  }
};
