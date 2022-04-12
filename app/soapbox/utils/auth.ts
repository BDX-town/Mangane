import { List as ImmutableList } from 'immutable';

import type { RootState } from 'soapbox/store';

export const validId = (id: any) => typeof id === 'string' && id !== 'null' && id !== 'undefined';

export const isURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const parseBaseURL = (url: any) => {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
};

export const getLoggedInAccount = (state: RootState) => {
  const me = state.me;
  return state.accounts.get(me);
};

export const isLoggedIn = (getState: () => RootState) => {
  return validId(getState().me);
};

export const getAppToken = (state: RootState) => state.auth.getIn(['app', 'access_token']);

export const getUserToken = (state: RootState, accountId?: string | false | null) => {
  const accountUrl = state.accounts.getIn([accountId, 'url']);
  return state.auth.getIn(['users', accountUrl, 'access_token']);
};

export const getAccessToken = (state: RootState) => {
  const me = state.me;
  return getUserToken(state, me);
};

export const getAuthUserId = (state: RootState) => {
  const me = state.auth.get('me');

  return ImmutableList([
    state.auth.getIn(['users', me, 'id']),
    me,
  ]).find(validId);
};

export const getAuthUserUrl = (state: RootState) => {
  const me = state.auth.get('me');

  return ImmutableList([
    state.auth.getIn(['users', me, 'url']),
    me,
  ]).find(isURL);
};

/** Get the VAPID public key. */
export const getVapidKey = (state: RootState) => {
  return state.auth.getIn(['app', 'vapid_key']) || state.instance.getIn(['pleroma', 'vapid_public_key']);
};
