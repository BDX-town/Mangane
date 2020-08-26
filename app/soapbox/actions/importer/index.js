import { getSettings } from '../settings';
import {
  normalizeAccount,
  normalizeStatus,
  normalizePoll,
  normalizeChat,
} from './normalizer';

export const ACCOUNT_IMPORT  = 'ACCOUNT_IMPORT';
export const ACCOUNTS_IMPORT = 'ACCOUNTS_IMPORT';
export const STATUS_IMPORT   = 'STATUS_IMPORT';
export const STATUSES_IMPORT = 'STATUSES_IMPORT';
export const POLLS_IMPORT    = 'POLLS_IMPORT';
export const ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP = 'ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP';
export const CHATS_IMPORT    = 'CHATS_IMPORT';
export const CHAT_MESSAGES_IMPORT = 'CHAT_MESSAGES_IMPORT';

function pushUnique(array, object) {
  if (array.every(element => element.id !== object.id)) {
    array.push(object);
  }
}

export function importAccount(account) {
  return { type: ACCOUNT_IMPORT, account };
}

export function importAccounts(accounts) {
  return { type: ACCOUNTS_IMPORT, accounts };
}

export function importStatus(status) {
  return { type: STATUS_IMPORT, status };
}

export function importStatuses(statuses) {
  return { type: STATUSES_IMPORT, statuses };
}

export function importPolls(polls) {
  return { type: POLLS_IMPORT, polls };
}

export function importChats(chats) {
  return { type: CHATS_IMPORT, chats };
}

export function importChatMessages(chatMessages) {
  return { type: CHAT_MESSAGES_IMPORT, chatMessages };
}

export function importFetchedAccount(account) {
  return importFetchedAccounts([account]);
}

export function importFetchedAccounts(accounts) {
  const normalAccounts = [];

  function processAccount(account) {
    pushUnique(normalAccounts, normalizeAccount(account));

    if (account.moved) {
      processAccount(account.moved);
    }
  }

  accounts.forEach(processAccount);

  return importAccounts(normalAccounts);
}

export function importFetchedStatus(status) {
  return importFetchedStatuses([status]);
}

export function importFetchedStatuses(statuses) {
  return (dispatch, getState) => {
    const accounts = [];
    const normalStatuses = [];
    const polls = [];

    function processStatus(status) {
      const normalOldStatus = getState().getIn(['statuses', status.id]);
      const expandSpoilers = getSettings(getState()).get('expandSpoilers');

      pushUnique(normalStatuses, normalizeStatus(status, normalOldStatus, expandSpoilers));
      pushUnique(accounts, status.account);

      if (status.reblog && status.reblog.id) {
        processStatus(status.reblog);
      }

      if (status.poll && status.poll.id) {
        pushUnique(polls, normalizePoll(status.poll));
      }
    }

    statuses.forEach(processStatus);

    dispatch(importPolls(polls));
    dispatch(importFetchedAccounts(accounts));
    dispatch(importStatuses(normalStatuses));
  };
}

export function importFetchedPoll(poll) {
  return dispatch => {
    dispatch(importPolls([normalizePoll(poll)]));
  };
}

export function importErrorWhileFetchingAccountByUsername(username) {
  return { type: ACCOUNT_FETCH_FAIL_FOR_USERNAME_LOOKUP, username };
};

export function importFetchedChat(chat) {
  return importFetchedChats([chat]);
}

export function importFetchedChats(chats) {
  return (dispatch, getState) => {
    const accounts = [];
    const chatMessages = [];
    const normalChats = [];

    function processChat(chat) {
      const normalOldChat = getState().getIn(['chats', chat.id]);

      pushUnique(normalChats, normalizeChat(chat, normalOldChat));
      pushUnique(accounts, chat.account);
      pushUnique(chatMessages, chat.last_message);
    }

    chats.forEach(processChat);

    dispatch(importFetchedAccounts(accounts));
    dispatch(importChatMessages(chatMessages));
    dispatch(importChats(normalChats));
  };
}
