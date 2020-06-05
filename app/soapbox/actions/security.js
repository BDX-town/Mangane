import api from '../api';

export const CHANGE_EMAIL_REQUEST = 'CHANGE_EMAIL_REQUEST';
export const CHANGE_EMAIL_SUCCESS = 'CHANGE_EMAIL_SUCCESS';
export const CHANGE_EMAIL_FAIL    = 'CHANGE_EMAIL_FAIL';

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL    = 'CHANGE_PASSWORD_FAIL';

export function changeEmail(email, password) {
  return (dispatch, getState) => {
    dispatch({ type: CHANGE_EMAIL_REQUEST, email });
    return api(getState).post('/api/pleroma/change_email', {
      email,
      password,
    }).then(response => {
      dispatch({ type: CHANGE_EMAIL_SUCCESS, email, response });
    }).catch(error => {
      dispatch({ type: CHANGE_EMAIL_FAIL, email, error, skipAlert: true });
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
      dispatch({ type: CHANGE_PASSWORD_SUCCESS, response });
    }).catch(error => {
      dispatch({ type: CHANGE_PASSWORD_FAIL, error });
    });
  };
}
