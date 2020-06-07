import { Map as ImmutableMap } from 'immutable';
import { List as ImmutableList } from 'immutable';

export const getDomain = account => {
  let re = /https?:\/\/(.*?)\//i;
  return re.exec(account.get('url'))[1];
};

// user@domain even for local users
export const acctFull = account => {
  let [user, domain] = account.get('acct').split('@');
  try {
    if (!domain) domain = getDomain(account);
  } catch(e) {
    console.warning('Could not get domain for acctFull. Falling back to acct.');
    return account.get('acct');
  }
  return [user, domain].join('@');
};

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
