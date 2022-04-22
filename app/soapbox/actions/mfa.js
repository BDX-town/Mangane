import api from '../api';

export const MFA_FETCH_REQUEST = 'MFA_FETCH_REQUEST';
export const MFA_FETCH_SUCCESS = 'MFA_FETCH_SUCCESS';
export const MFA_FETCH_FAIL    = 'MFA_FETCH_FAIL';

export const MFA_BACKUP_CODES_FETCH_REQUEST = 'MFA_BACKUP_CODES_FETCH_REQUEST';
export const MFA_BACKUP_CODES_FETCH_SUCCESS = 'MFA_BACKUP_CODES_FETCH_SUCCESS';
export const MFA_BACKUP_CODES_FETCH_FAIL    = 'MFA_BACKUP_CODES_FETCH_FAIL';

export const MFA_SETUP_REQUEST = 'MFA_SETUP_REQUEST';
export const MFA_SETUP_SUCCESS = 'MFA_SETUP_SUCCESS';
export const MFA_SETUP_FAIL    = 'MFA_SETUP_FAIL';

export const MFA_CONFIRM_REQUEST = 'MFA_CONFIRM_REQUEST';
export const MFA_CONFIRM_SUCCESS = 'MFA_CONFIRM_SUCCESS';
export const MFA_CONFIRM_FAIL    = 'MFA_CONFIRM_FAIL';

export const MFA_DISABLE_REQUEST = 'MFA_DISABLE_REQUEST';
export const MFA_DISABLE_SUCCESS = 'MFA_DISABLE_SUCCESS';
export const MFA_DISABLE_FAIL    = 'MFA_DISABLE_FAIL';

export function fetchMfa() {
  return (dispatch, getState) => {
    dispatch({ type: MFA_FETCH_REQUEST });
    return api(getState).get('/api/pleroma/accounts/mfa').then(({ data }) => {
      dispatch({ type: MFA_FETCH_SUCCESS, data });
    }).catch(error => {
      dispatch({ type: MFA_FETCH_FAIL });
    });
  };
}

export function fetchBackupCodes() {
  return (dispatch, getState) => {
    dispatch({ type: MFA_BACKUP_CODES_FETCH_REQUEST });
    return api(getState).get('/api/pleroma/accounts/mfa/backup_codes').then(({ data }) => {
      dispatch({ type: MFA_BACKUP_CODES_FETCH_SUCCESS, data });
      return data;
    }).catch(error => {
      dispatch({ type: MFA_BACKUP_CODES_FETCH_FAIL });
    });
  };
}

export function setupMfa(method) {
  return (dispatch, getState) => {
    dispatch({ type: MFA_SETUP_REQUEST, method });
    return api(getState).get(`/api/pleroma/accounts/mfa/setup/${method}`).then(({ data }) => {
      dispatch({ type: MFA_SETUP_SUCCESS, data });
      return data;
    }).catch(error => {
      dispatch({ type: MFA_SETUP_FAIL });
      throw error;
    });
  };
}

export function confirmMfa(method, code, password) {
  return (dispatch, getState) => {
    const params = { code, password };
    dispatch({ type: MFA_CONFIRM_REQUEST, method, code });
    return api(getState).post(`/api/pleroma/accounts/mfa/confirm/${method}`, params).then(({ data }) => {
      dispatch({ type: MFA_CONFIRM_SUCCESS, method, code });
      return data;
    }).catch(error => {
      dispatch({ type: MFA_CONFIRM_FAIL, method, code, error, skipAlert: true });
      throw error;
    });
  };
}

export function disableMfa(method, password) {
  return (dispatch, getState) => {
    dispatch({ type: MFA_DISABLE_REQUEST, method });
    return api(getState).delete(`/api/pleroma/accounts/mfa/${method}`, { data: { password } }).then(({ data }) => {
      dispatch({ type: MFA_DISABLE_SUCCESS, method });
      return data;
    }).catch(error => {
      dispatch({ type: MFA_DISABLE_FAIL, method, skipAlert: true });
      throw error;
    });
  };
}
