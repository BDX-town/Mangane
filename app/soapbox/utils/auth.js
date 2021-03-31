export const isLoggedIn = getState => {
  return typeof getState().get('me') === 'string';
};

export const getAppToken = state => state.getIn(['auth', 'app', 'access_token']);

export const getUserToken = (state, accountId) => {
  return state.getIn(['auth', 'users', accountId, 'access_token']);
};

export const getAccessToken = state => {
  const me = state.get('me');
  return getUserToken(state, me);
};
