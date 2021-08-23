import { Map as ImmutableMap } from 'immutable';
import { List as ImmutableList } from 'immutable';

const getDomainFromURL = account => {
  try {
    const url = account.get('url');
    return new URL(url).host;
  } catch {
    return '';
  }
};

export const getDomain = account => {
  const domain = account.get('acct').split('@')[1];
  return domain ? domain : getDomainFromURL(account);
};

export const guessFqn = account => {
  const [user, domain] = account.get('acct').split('@');
  if (!domain) return [user, getDomainFromURL(account)].join('@');
  return account.get('acct');
};

export const getBaseURL = account => {
  try {
    const url = account.get('url');
    return new URL(url).origin;
  } catch {
    return '';
  }
};

// user@domain even for local users
export const acctFull = account => (
  account.get('fqn') || guessFqn(account)
);

export const getAcct = (account, displayFqn) => (
  displayFqn === true ? acctFull(account) : account.get('acct')
);

export const isStaff = (account = ImmutableMap()) => (
  [isAdmin, isModerator].some(f => f(account) === true)
);

export const isAdmin = account => (
  account.getIn(['pleroma', 'is_admin']) === true
);

export const isModerator = account => (
  account.getIn(['pleroma', 'is_moderator']) === true
);

export const getFollowDifference = (state, accountId, type) => {
  const listSize = state.getIn(['user_lists', type, accountId, 'items'], ImmutableList()).size;
  const counter = state.getIn(['accounts_counters', accountId, `${type}_count`], 0);
  return Math.max(counter - listSize, 0);
};

export const isLocal = account => {
  const domain = account.get('acct').split('@')[1];
  return domain === undefined ? true : false;
};

export const isRemote = account => !isLocal(account);

export const isVerified = account => (
  account.getIn(['pleroma', 'tags'], ImmutableList()).includes('verified')
);
