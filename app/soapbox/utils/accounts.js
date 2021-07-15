import { Map as ImmutableMap } from 'immutable';
import { List as ImmutableList } from 'immutable';

const guessDomain = account => {
  try {
    let re = /https?:\/\/(.*?)\//i;
    return re.exec(account.get('url'))[1];
  } catch(e) {
    return null;
  }
};

export const getDomain = account => {
  let domain = account.get('acct').split('@')[1];
  if (!domain) domain = guessDomain(account);
  return domain;
};

export const guessFqn = account => {
  const [user, domain] = account.get('acct').split('@');
  if (!domain) return [user, guessDomain(account)].join('@');
  return account.get('acct');
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
  const counter = state.getIn(['accounts', accountId, `${type}_count`], 0);
  return Math.max(counter - listSize, 0);
};

export const isLocal = account => {
  let domain = account.get('acct').split('@')[1];
  return domain === undefined ? true : false;
};

export const isVerified = account => (
  account.getIn(['pleroma', 'tags'], ImmutableList()).includes('verified')
);
