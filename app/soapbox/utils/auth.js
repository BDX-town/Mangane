export const isLoggedIn = getState => {
  return typeof getState().get('me') === 'string';
};

export const getAccessToken = state => {
  const me = state.get('me');
  return state.getIn(['auth', 'users', me, 'access_token']);
};
