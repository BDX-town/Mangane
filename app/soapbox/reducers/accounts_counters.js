import {
  ACCOUNT_FETCH_SUCCESS,
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
  ACCOUNT_FOLLOW_SUCCESS,
  ACCOUNT_UNFOLLOW_SUCCESS,
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
  STREAMING_FOLLOW_RELATIONSHIPS_UPDATE,
} from 'soapbox/actions/streaming';
import { Map as ImmutableMap, fromJS } from 'immutable';

const importAccount = (state, account) => {
  return state.set(account.id, fromJS({
    followers_count: account.followers_count,
    following_count: account.following_count,
    statuses_count: account.statuses_count,
  }));
};

const importAccounts = (state, accounts) => {
  return state.withMutations(state => {
    accounts.forEach(account => importAccount(state, account));
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

const updateFollowCounters = (state, counterUpdates) => {
  return state.withMutations(state => {
    counterUpdates.forEach(counterUpdate => {
      state.update(counterUpdate.id, ImmutableMap(), counters => counters.merge({
        followers_count: counterUpdate.follower_count,
        following_count: counterUpdate.following_count,
      }));
    });
  });
};

const initialState = ImmutableMap();

export default function accountsCounters(state = initialState, action) {
  switch(action.type) {
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
  case ACCOUNT_FOLLOW_SUCCESS:
    return action.alreadyFollowing ? state :
      state.updateIn([action.relationship.id, 'followers_count'], num => num + 1);
  case ACCOUNT_UNFOLLOW_SUCCESS:
    return state.updateIn([action.relationship.id, 'followers_count'], num => Math.max(0, num - 1));
  case STREAMING_FOLLOW_RELATIONSHIPS_UPDATE:
    return updateFollowCounters(state, [action.follower, action.following]);
  default:
    return state;
  }
};
