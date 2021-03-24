export const getAccessToken = state => {
  const me = state.getIn(['auth', 'me']);
  return state.getIn(['auth', 'users', me, 'access_token']);
};
