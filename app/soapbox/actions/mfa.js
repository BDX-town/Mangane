import api from '../api';

export const TOTP_SETTINGS_FETCH_REQUEST = 'TOTP_SETTINGS_FETCH_REQUEST';
export const TOTP_SETTINGS_FETCH_SUCCESS = 'TOTP_SETTINGS_FETCH_SUCCESS';
export const TOTP_SETTINGS_FETCH_FAIL = 'TOTP_SETTINGS_FETCH_FAIL';

export const BACKUP_CODES_FETCH_REQUEST = 'BACKUP_CODES_FETCH_REQUEST';
export const BACKUP_CODES_FETCH_SUCCESS = 'BACKUP_CODES_FETCH_SUCCESS';
export const BACKUP_CODES_FETCH_FAIL = 'BACKUP_CODES_FETCH_FAIL';

export const TOTP_SETUP_FETCH_REQUEST = 'TOTP_SETUP_FETCH_REQUEST';
export const TOTP_SETUP_FETCH_SUCCESS = 'TOTP_SETUP_FETCH_SUCCESS';
export const TOTP_SETUP_FETCH_FAIL = 'TOTP_SETUP_FETCH_FAIL';

export const CONFIRM_TOTP_REQUEST = 'CONFIRM_TOTP_REQUEST';
export const CONFIRM_TOTP_SUCCESS = 'CONFIRM_TOTP_SUCCESS';
export const CONFIRM_TOTP_FAIL = 'CONFIRM_TOTP_FAIL';

export const DISABLE_TOTP_REQUEST = 'DISABLE_TOTP_REQUEST';
export const DISABLE_TOTP_SUCCESS = 'DISABLE_TOTP_SUCCESS';
export const DISABLE_TOTP_FAIL = 'DISABLE_TOTP_FAIL';

export function fetchUserMfaSettings() {
  return (dispatch, getState) => {
    dispatch({ type: TOTP_SETTINGS_FETCH_REQUEST });
    return api(getState).get('/api/pleroma/accounts/mfa').then(response => {
      dispatch({ type: TOTP_SETTINGS_FETCH_SUCCESS, totpEnabled: response.data.totp });
      return response;
    }).catch(error => {
      dispatch({ type: TOTP_SETTINGS_FETCH_FAIL });
    });
  };
}

export function fetchUserMfaSettingsRequest() {
  return {
    type: TOTP_SETTINGS_FETCH_REQUEST,
  };
}

export function fetchUserMfaSettingsSuccess() {
  return {
    type: TOTP_SETTINGS_FETCH_SUCCESS,
  };
}

export function fetchUserMfaSettingsFail() {
  return {
    type: TOTP_SETTINGS_FETCH_FAIL,
  };
}

export function fetchBackupCodes() {
  return (dispatch, getState) => {
    dispatch({ type: BACKUP_CODES_FETCH_REQUEST });
    return api(getState).get('/api/pleroma/accounts/mfa/backup_codes').then(response => {
      dispatch({ type: BACKUP_CODES_FETCH_SUCCESS, backup_codes: response.data });
      return response;
    }).catch(error => {
      dispatch({ type: BACKUP_CODES_FETCH_FAIL });
    });
  };
}

export function fetchBackupCodesRequest() {
  return {
    type: BACKUP_CODES_FETCH_REQUEST,
  };
}

export function fetchBackupCodesSuccess(backup_codes, response) {
  return {
    type: BACKUP_CODES_FETCH_SUCCESS,
    backup_codes: response.data,
  };
}

export function fetchBackupCodesFail(error) {
  return {
    type: BACKUP_CODES_FETCH_FAIL,
    error,
  };
}

export function fetchToptSetup() {
  return (dispatch, getState) => {
    dispatch({ type: TOTP_SETUP_FETCH_REQUEST });
    return api(getState).get('/api/pleroma/accounts/mfa/setup/totp').then(response => {
      dispatch({ type: TOTP_SETUP_FETCH_SUCCESS, totp_setup: response.data });
      return response;
    }).catch(error => {
      dispatch({ type: TOTP_SETUP_FETCH_FAIL });
    });
  };
}

export function fetchToptSetupRequest() {
  return {
    type: TOTP_SETUP_FETCH_REQUEST,
  };
}

export function fetchToptSetupSuccess(totp_setup, response) {
  return {
    type: TOTP_SETUP_FETCH_SUCCESS,
    totp_setup: response.data,
  };
}

export function fetchToptSetupFail(error) {
  return {
    type: TOTP_SETUP_FETCH_FAIL,
    error,
  };
}

export function confirmToptSetup(code, password) {
  return (dispatch, getState) => {
    dispatch({ type: CONFIRM_TOTP_REQUEST, code });
    return api(getState).post('/api/pleroma/accounts/mfa/confirm/totp', {
      code,
      password,
    }).then(response => {
      dispatch({ type: CONFIRM_TOTP_SUCCESS });
      return response;
    }).catch(error => {
      dispatch({ type: CONFIRM_TOTP_FAIL });
    });
  };
}

export function confirmToptRequest() {
  return {
    type: CONFIRM_TOTP_REQUEST,
  };
}

export function confirmToptSuccess(backup_codes, response) {
  return {
    type: CONFIRM_TOTP_SUCCESS,
  };
}

export function confirmToptFail(error) {
  return {
    type: CONFIRM_TOTP_FAIL,
    error,
  };
}

export function disableToptSetup(password) {
  return (dispatch, getState) => {
    dispatch({ type: DISABLE_TOTP_REQUEST });
    return api(getState).delete('/api/pleroma/accounts/mfa/totp', { data: { password } }).then(response => {
      dispatch({ type: DISABLE_TOTP_SUCCESS });
      return response;
    }).catch(error => {
      dispatch({ type: DISABLE_TOTP_FAIL });
    });
  };
}

export function disableToptRequest() {
  return {
    type: DISABLE_TOTP_REQUEST,
  };
}

export function disableToptSuccess(backup_codes, response) {
  return {
    type: DISABLE_TOTP_SUCCESS,
  };
}

export function disableToptFail(error) {
  return {
    type: DISABLE_TOTP_FAIL,
    error,
  };
}
