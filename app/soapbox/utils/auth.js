import { List as ImmutableList } from 'immutable';

export const validId = id => typeof id === 'string' && id !== 'null' && id !== 'undefined';

export const isURL = url => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const parseBaseURL = url => {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
};

export const getLoggedInAccount = state => {
  const me = state.get('me');
  return state.getIn(['accounts', me]);
};

export const isLoggedIn = getState => {
  return validId(getState().get('me'));
};

export const getAppToken = state => state.getIn(['auth', 'app', 'access_token']);

export const getUserToken = (state, accountId) => {
  const accountUrl = state.getIn(['accounts', accountId, 'url']);
  return state.getIn(['auth', 'users', accountUrl, 'access_token']);
};

export const getAccessToken = state => {
  const me = state.get('me');
  return getUserToken(state, me);
};

export const getAuthUserId = state => {
  const me = state.getIn(['auth', 'me']);

  return ImmutableList([
    state.getIn(['auth', 'users', me, 'id']),
    me,
  ]).find(validId);
};

export const getAuthUserUrl = state => {
  const me = state.getIn(['auth', 'me']);

  return ImmutableList([
    state.getIn(['auth', 'users', me, 'url']),
    me,
  ]).find(isURL);
};
