import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

const getDomainFromURL = (account: ImmutableMap<string, any>): string => {
  try {
    const url = account.get('url');
    return new URL(url).host;
  } catch {
    return '';
  }
};

export const getDomain = (account: ImmutableMap<string, any>): string => {
  const domain = account.get('acct').split('@')[1];
  return domain ? domain : getDomainFromURL(account);
};

export const guessFqn = (account: ImmutableMap<string, any>): string => {
  const [user, domain] = account.get('acct').split('@');
  if (!domain) return [user, getDomainFromURL(account)].join('@');
  return account.get('acct');
};

export const getBaseURL = (account: ImmutableMap<string, any>): string => {
  try {
    const url = account.get('url');
    return new URL(url).origin;
  } catch {
    return '';
  }
};

// user@domain even for local users
export const acctFull = (account: ImmutableMap<string, any>): string => (
  account.get('fqn') || guessFqn(account)
);

export const getAcct = (account: ImmutableMap<string, any>, displayFqn: boolean): string => (
  displayFqn === true ? acctFull(account) : account.get('acct')
);

export const isStaff = (account: ImmutableMap<any, any> = ImmutableMap()): boolean => (
  [isAdmin, isModerator].some(f => f(account) === true)
);

export const isAdmin = (account: ImmutableMap<string, any>): boolean => (
  account.getIn(['pleroma', 'is_admin']) === true
);

export const isModerator = (account: ImmutableMap<string, any>): boolean => (
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

export const accountToMention = (account: ImmutableMap<string, any>): ImmutableMap<string, any> => {
  return ImmutableMap({
    id: account.get('id'),
    username: account.get('username'),
    acct: account.get('acct'),
    url: account.get('url'),
  });
};
