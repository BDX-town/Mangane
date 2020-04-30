import api from '../api';
import { showAlert, showAlertForError } from 'gabsocial/actions/alerts';
import { fetchMe } from 'gabsocial/actions/me';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';

export const AUTH_REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
export const AUTH_REGISTER_FAIL    = 'AUTH_REGISTER_FAIL';

const hasAppToken = getState => getState().hasIn(['auth', 'app', 'access_token']);
const noOp = () => () => new Promise(f => f());

function initAuthApp() {
  return (dispatch, getState) => {
    const hasToken = hasAppToken(getState);
    const action   = hasToken ? noOp : createAppAndToken;
    return dispatch(action())
      .catch(error => {
        dispatch(showAlertForError(error));
      });
  };
}

function createAppAndToken() {
  return (dispatch, getState) => {
    return dispatch(createApp()).then(() => {
      return dispatch(createAppToken());
    });
  };
}

const appName = () => {
  const timestamp = (new Date()).toISOString();
  return `SoapboxFE_${timestamp}`; // TODO: Add commit hash
};

function createApp() {
  return (dispatch, getState) => {
    return api(getState, 'app').post('/api/v1/apps', {
      client_name:   appName(),
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes:        'read write follow push admin',
    }).then(response => {
      return dispatch(authAppCreated(response.data));
    });
  };
}

function createAppToken() {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);

    return api(getState, 'app').post('/oauth/token', {
      client_id:     app.get('client_id'),
      client_secret: app.get('client_secret'),
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'client_credentials',
    }).then(response => {
      return dispatch(authAppAuthorized(response.data));
    });
  };
}

function createUserToken(username, password) {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);
    return api(getState, 'app').post('/oauth/token', {
      client_id:     app.get('client_id'),
      client_secret: app.get('client_secret'),
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'password',
      username:      username,
      password:      password,
    });
  };
}

export function logIn(username, password) {
  return (dispatch, getState) => {
    return dispatch(initAuthApp()).then(() => {
      return dispatch(createUserToken(username, password));
    }).then(response => {
      return dispatch(authLoggedIn(response.data));
    }).catch(error => {
      dispatch(showAlert('Login failed.', 'Invalid username or password.'));
      throw error;
    });
  };
}

export function logOut() {
  return (dispatch, getState) => {
    dispatch({ type: AUTH_LOGGED_OUT });
    dispatch(showAlert('Successfully logged out.', ''));
  };
}

export function register(params) {
  return (dispatch, getState) => {
    dispatch({ type: AUTH_REGISTER_REQUEST });
    return dispatch(initAuthApp()).then(() => {
      return api(getState, 'app').post('/api/v1/accounts', params);
    }).then(response => {
      dispatch({ type: AUTH_REGISTER_SUCCESS, token: response.data });
      dispatch(authLoggedIn(response.data));
      return dispatch(fetchMe());
    }).catch(error => {
      dispatch({ type: AUTH_REGISTER_FAIL, error });
    });
  };
}

export function fetchCaptcha() {
  return (dispatch, getState) => {
    return api(getState).get('/api/pleroma/captcha');
  };
}

export function authAppCreated(app) {
  return {
    type: AUTH_APP_CREATED,
    app,
  };
}

export function authAppAuthorized(app) {
  return {
    type: AUTH_APP_AUTHORIZED,
    app,
  };
}

export function authLoggedIn(user) {
  return {
    type: AUTH_LOGGED_IN,
    user,
  };
}
