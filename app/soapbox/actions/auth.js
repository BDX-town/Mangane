import api from '../api';
import { showAlert } from 'soapbox/actions/alerts';
import { fetchMe } from 'soapbox/actions/me';

export const AUTH_APP_CREATED    = 'AUTH_APP_CREATED';
export const AUTH_APP_AUTHORIZED = 'AUTH_APP_AUTHORIZED';
export const AUTH_LOGGED_IN      = 'AUTH_LOGGED_IN';
export const AUTH_LOGGED_OUT     = 'AUTH_LOGGED_OUT';

export const AUTH_REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
export const AUTH_REGISTER_FAIL    = 'AUTH_REGISTER_FAIL';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAIL    = 'RESET_PASSWORD_FAIL';

export const CHANGE_EMAIL_REQUEST = 'CHANGE_EMAIL_REQUEST';
export const CHANGE_EMAIL_SUCCESS = 'CHANGE_EMAIL_SUCCESS';
export const CHANGE_EMAIL_FAIL    = 'CHANGE_EMAIL_FAIL';

export const DELETE_ACCOUNT_REQUEST = 'DELETE_ACCOUNT_REQUEST';
export const DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS';
export const DELETE_ACCOUNT_FAIL    = 'DELETE_ACCOUNT_FAIL';

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL    = 'CHANGE_PASSWORD_FAIL';

export const FETCH_TOKENS_REQUEST = 'FETCH_TOKENS_REQUEST';
export const FETCH_TOKENS_SUCCESS = 'FETCH_TOKENS_SUCCESS';
export const FETCH_TOKENS_FAIL    = 'FETCH_TOKENS_FAIL';

export const REVOKE_TOKEN_REQUEST = 'REVOKE_TOKEN_REQUEST';
export const REVOKE_TOKEN_SUCCESS = 'REVOKE_TOKEN_SUCCESS';
export const REVOKE_TOKEN_FAIL    = 'REVOKE_TOKEN_FAIL';

const noOp = () => () => new Promise(f => f());

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
    }).then(response => {
      dispatch(authLoggedIn(response.data));
    });
  };
}

export function refreshUserToken() {
  return (dispatch, getState) => {
    const refreshToken = getState().getIn(['auth', 'user', 'refresh_token']);
    const app = getState().getIn(['auth', 'app']);

    if (!refreshToken) return dispatch(noOp());

    return api(getState, 'app').post('/oauth/token', {
      client_id:     app.get('client_id'),
      client_secret: app.get('client_secret'),
      refresh_token: refreshToken,
      redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
      grant_type:    'refresh_token',
    }).then(response => {
      dispatch(authLoggedIn(response.data));
    });
  };
}

export function otpVerify(code, mfa_token) {
  return (dispatch, getState) => {
    const app = getState().getIn(['auth', 'app']);
    return api(getState, 'app').post('/oauth/mfa/challenge', {
      client_id: app.get('client_id'),
      client_secret: app.get('client_secret'),
      mfa_token: mfa_token,
      code: code,
      challenge_type: 'totp',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    }).then(response => {
      dispatch(authLoggedIn(response.data));
    });
  };
}

export function logIn(username, password) {
  return (dispatch, getState) => {
    return dispatch(createAppAndToken()).then(() => {
      return dispatch(createUserToken(username, password));
    }).catch(error => {
      if (error.response.data.error === 'mfa_required') {
        throw error;
      } else {
        dispatch(showAlert('Login failed.', 'Invalid username or password.'));
      }
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
    const needsConfirmation = getState().getIn(['instance', 'pleroma', 'metadata', 'account_activation_required']);
    const needsApproval = getState().getIn(['instance', 'approval_required']);
    params.fullname = params.username;
    dispatch({ type: AUTH_REGISTER_REQUEST });
    return dispatch(createAppAndToken()).then(() => {
      return api(getState, 'app').post('/api/v1/accounts', params);
    }).then(response => {
      dispatch({ type: AUTH_REGISTER_SUCCESS, token: response.data });
      dispatch(authLoggedIn(response.data));
      if (needsConfirmation) {
        return dispatch(showAlert('', 'Check your email for further instructions.'));
      } else if (needsApproval) {
        return dispatch(showAlert('', 'Your account has been submitted for approval.'));
      } else {
        return dispatch(fetchMe());
      }
    }).catch(error => {
      dispatch({ type: AUTH_REGISTER_FAIL, error });
      throw error;
    });
  };
}

export function fetchCaptcha() {
  return (dispatch, getState) => {
    return api(getState).get('/api/pleroma/captcha');
  };
}

export function resetPassword(nickNameOrEmail) {
  return (dispatch, getState) => {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    const params =
      nickNameOrEmail.includes('@')
        ? { email: nickNameOrEmail }
        : { nickname: nickNameOrEmail };
    return api(getState).post('/auth/password', params).then(() => {
      dispatch({ type: RESET_PASSWORD_SUCCESS });
    }).catch(error => {
      dispatch({ type: RESET_PASSWORD_FAIL, error });
      throw error;
    });
  };
}

export function changeEmail(email, password) {
  return (dispatch, getState) => {
    dispatch({ type: CHANGE_EMAIL_REQUEST, email });
    return api(getState).post('/api/pleroma/change_email', {
      email,
      password,
    }).then(response => {
      if (response.data.error) throw response.data.error; // This endpoint returns HTTP 200 even on failure
      dispatch({ type: CHANGE_EMAIL_SUCCESS, email, response });
    }).catch(error => {
      dispatch({ type: CHANGE_EMAIL_FAIL, email, error, skipAlert: true });
      throw error;
    });
  };
}

export function deleteAccount(password) {
  return (dispatch, getState) => {
    dispatch({ type: DELETE_ACCOUNT_REQUEST });
    return api(getState).post('/api/pleroma/delete_account', {
      password,
    }).then(response => {
      if (response.data.error) throw response.data.error; // This endpoint returns HTTP 200 even on failure
      dispatch({ type: DELETE_ACCOUNT_SUCCESS, response });
      dispatch({ type: AUTH_LOGGED_OUT });
      dispatch(showAlert('Successfully logged out.', ''));
    }).catch(error => {
      dispatch({ type: DELETE_ACCOUNT_FAIL, error, skipAlert: true });
      throw error;
    });
  };
}

export function changePassword(oldPassword, newPassword, confirmation) {
  return (dispatch, getState) => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    return api(getState).post('/api/pleroma/change_password', {
      password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: confirmation,
    }).then(response => {
      if (response.data.error) throw response.data.error; // This endpoint returns HTTP 200 even on failure
      dispatch({ type: CHANGE_PASSWORD_SUCCESS, response });
    }).catch(error => {
      dispatch({ type: CHANGE_PASSWORD_FAIL, error, skipAlert: true });
      throw error;
    });
  };
}

export function fetchOAuthTokens() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_TOKENS_REQUEST });
    return api(getState).get('/api/oauth_tokens.json').then(response => {
      dispatch({ type: FETCH_TOKENS_SUCCESS, tokens: response.data });
    }).catch(error => {
      dispatch({ type: FETCH_TOKENS_FAIL });
    });
  };
}

export function revokeOAuthToken(id) {
  return (dispatch, getState) => {
    dispatch({ type: REVOKE_TOKEN_REQUEST, id });
    return api(getState).delete(`/api/oauth_tokens/${id}`).then(response => {
      dispatch({ type: REVOKE_TOKEN_SUCCESS, id });
    }).catch(error => {
      dispatch({ type: REVOKE_TOKEN_FAIL, id });
    });
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
