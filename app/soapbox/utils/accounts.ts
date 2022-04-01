import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

import { Account } from 'soapbox/types/entities';

const getDomainFromURL = (account: Account): string => {
  try {
    const url = account.url;
    return new URL(url).host;
  } catch {
    return '';
  }
};

export const getDomain = (account: Account): string => {
  const domain = account.acct.split('@')[1];
  return domain ? domain : getDomainFromURL(account);
};

export const getBaseURL = (account: ImmutableMap<string, any>): string => {
  try {
    const url = account.get('url');
    return new URL(url).origin;
  } catch {
    return '';
  }
};

export const getAcct = (account: Account, displayFqn: boolean): string => (
  displayFqn === true ? account.fqn : account.acct
);

export const isStaff = (account: Account): boolean => (
  [isAdmin, isModerator].some(f => f(account) === true)
);

export const isAdmin = (account: Account): boolean => (
  account.getIn(['pleroma', 'is_admin']) === true
);

export const isModerator = (account: Account): boolean => (
  account.getIn(['pleroma', 'is_moderator']) === true
);

export const getFollowDifference = (state: ImmutableMap<string, any>, accountId: string, type: string): number => {
  const items: any = state.getIn(['user_lists', type, accountId, 'items'], ImmutableOrderedSet());
  const counter: number = Number(state.getIn(['accounts_counters', accountId, `${type}_count`], 0));
  return Math.max(counter - items.size, 0);
};

export const isLocal = (account: ImmutableMap<string, any>): boolean => {
  const domain: string = account.get('acct').split('@')[1];
  return domain === undefined ? true : false;
};

export const isRemote = (account: ImmutableMap<string, any>): boolean => !isLocal(account);
