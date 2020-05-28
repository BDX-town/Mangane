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

export const getHasMoreFollowsCount = (state, accountId, isFollowing) => {
  let moreFollowsCount = undefined; //variable text in defaultMessage with null value preventing rendering
  let emptyList = ImmutableList();
  if (isFollowing) {
    let followingList = ImmutableList();
    followingList = state.getIn(['user_lists', 'following', accountId, 'items'], emptyList);
    moreFollowsCount = parseInt(state.getIn(['accounts_counters', accountId, 'following_count']), 0) - followingList.size;
  } else {
    let followersList = ImmutableList();
    followersList = state.getIn(['user_lists', 'followers', accountId, 'items'], emptyList);
    moreFollowsCount = parseInt(state.getIn(['accounts_counters', accountId, 'followers_count']), 0) - followersList.size;
  }
  return moreFollowsCount;
};
