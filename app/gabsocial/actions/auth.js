import api from '../api';

export const AUTH_APP_CREATED = 'AUTH_APP_CREATED';
export const AUTH_LOGGED_IN   = 'AUTH_LOGGED_IN';

export function createAuthApp() {
  return (dispatch, getState) => {
    api(getState).post('/api/v1/apps', {
      // TODO: Add commit hash to client_name
      client_name: `SoapboxFE_${(new Date()).toISOString()}`,
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes: 'read write follow push admin'
    }).then(response => {
      dispatch(authAppCreated(response.data));
    });
  }
}

export function logIn(username, password) {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);
    api(getState).post('/oauth/token', {
      client_id: app.client_id,
      client_secret: app.client_secret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'password',
      username: username,
      password: password
    }).then(response => {
      dispatch(authLoggedIn(response.data));
    });
  }
}

export function authAppCreated(app) {
  return {
    type: AUTH_APP_CREATED,
    app
  };
}

export function authLoggedIn(user) {
  return {
    type: AUTH_LOGGED_IN,
    user
  };
}
