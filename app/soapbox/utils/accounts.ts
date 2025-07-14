import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';

import type { Account } from 'soapbox/types/entities';

const getDomainFromURL = (account: Account): string => {
  try {
    const url = account.url;
    return new URL(url).host;
  } catch {
    return '';
  }
};

export function getAcctFormURL(maybeEncodedUrl: string) {
  if (!maybeEncodedUrl) return null;
  const url = new URL(decodeURIComponent(maybeEncodedUrl));
  const domain = url.host;
  const user = url.pathname.split('/').pop().replace(/@/g, '');
  if (!domain || !user) return null;
  return `@${user}@${domain}`;
}

export const getDomain = (account: Account): string => {
  const domain = account.acct.split('@')[1];
  return domain ? domain : getDomainFromURL(account);
};

export const getBaseURL = (account: Account): string => {
  try {
    return new URL(account.url).origin;
  } catch {
    return '';
  }
};

export const getAcct = (account: Account, displayFqn: boolean): string => (
  displayFqn === true ? account.fqn : account.acct
);

export const getFollowDifference = (state: ImmutableMap<string, any>, accountId: string, type: string): number => {
  const items: any = state.getIn(['user_lists', type, accountId, 'items'], ImmutableOrderedSet());
  const counter: number = Number(state.getIn(['accounts_counters', accountId, `${type}_count`], 0));
  return Math.max(counter - items.size, 0);
};

export const isLocal = (account: Account): boolean => {
  const domain: string = account.acct.split('@')[1];
  return domain === undefined ? true : false;
};

export const isRemote = (account: Account): boolean => !isLocal(account);
