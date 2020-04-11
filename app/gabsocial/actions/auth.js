import api from '../api';
import { showAlert } from 'gabsocial/actions/alerts';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';

export function createAuthApp() {
  return (dispatch, getState) => {
    return api(getState).post('/api/v1/apps', {
      // TODO: Add commit hash to client_name
      client_name: `SoapboxFE_${(new Date()).toISOString()}`,
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes: 'read write follow push admin'
    }).then(response => {
      dispatch(authAppCreated(response.data));
    }).then(() => {
      const app = getState().getIn(['auth', 'app']);
      return api(getState).post('/oauth/token', {
        client_id: app.get('client_id'),
        client_secret: app.get('client_secret'),
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
        grant_type: 'client_credentials'
      });
    }).then(response => {
      dispatch(authAppAuthorized(response.data));
    });
  }
}

export function logIn(username, password) {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);
    return api(getState).post('/oauth/token', {
      client_id: app.get('client_id'),
      client_secret: app.get('client_secret'),
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'password',
      username: username,
      password: password
    }).then(response => {
      dispatch(authLoggedIn(response.data));
    }).catch((error) => {
      dispatch(showAlert('Login failed.', 'Invalid username or password.'));
      throw error;
    });
  }
}

export function logOut() {
  return (dispatch, getState) => {
    dispatch({ type: AUTH_LOGGED_OUT });
    dispatch(showAlert('Successfully logged out.', ''));
  };
}

export function authAppCreated(app) {
  return {
    type: AUTH_APP_CREATED,
    app
  };
}

export function authAppAuthorized(app) {
  return {
    type: AUTH_APP_AUTHORIZED,
    app
  };
}

export function authLoggedIn(user) {
  return {
    type: AUTH_LOGGED_IN,
    user
  };
}
