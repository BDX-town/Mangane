import api from '../api';

import type { AxiosError } from 'axios';
import type { AppDispatch, RootState } from 'soapbox/store';

const MFA_FETCH_REQUEST = 'MFA_FETCH_REQUEST';
const MFA_FETCH_SUCCESS = 'MFA_FETCH_SUCCESS';
const MFA_FETCH_FAIL    = 'MFA_FETCH_FAIL';

const MFA_BACKUP_CODES_FETCH_REQUEST = 'MFA_BACKUP_CODES_FETCH_REQUEST';
const MFA_BACKUP_CODES_FETCH_SUCCESS = 'MFA_BACKUP_CODES_FETCH_SUCCESS';
const MFA_BACKUP_CODES_FETCH_FAIL    = 'MFA_BACKUP_CODES_FETCH_FAIL';

const MFA_SETUP_REQUEST = 'MFA_SETUP_REQUEST';
const MFA_SETUP_SUCCESS = 'MFA_SETUP_SUCCESS';
const MFA_SETUP_FAIL    = 'MFA_SETUP_FAIL';

const MFA_CONFIRM_REQUEST = 'MFA_CONFIRM_REQUEST';
const MFA_CONFIRM_SUCCESS = 'MFA_CONFIRM_SUCCESS';
const MFA_CONFIRM_FAIL    = 'MFA_CONFIRM_FAIL';

const MFA_DISABLE_REQUEST = 'MFA_DISABLE_REQUEST';
const MFA_DISABLE_SUCCESS = 'MFA_DISABLE_SUCCESS';
const MFA_DISABLE_FAIL    = 'MFA_DISABLE_FAIL';

const fetchMfa = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: MFA_FETCH_REQUEST });
    return api(getState).get('/api/pleroma/accounts/mfa').then(({ data }) => {
      dispatch({ type: MFA_FETCH_SUCCESS, data });
    }).catch(() => {
      dispatch({ type: MFA_FETCH_FAIL });
    });
  };

const fetchBackupCodes = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: MFA_BACKUP_CODES_FETCH_REQUEST });
    return api(getState).get('/api/pleroma/accounts/mfa/backup_codes').then(({ data }) => {
      dispatch({ type: MFA_BACKUP_CODES_FETCH_SUCCESS, data });
      return data;
    }).catch(() => {
      dispatch({ type: MFA_BACKUP_CODES_FETCH_FAIL });
    });
  };

const setupMfa = (method: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: MFA_SETUP_REQUEST, method });
    return api(getState).get(`/api/pleroma/accounts/mfa/setup/${method}`).then(({ data }) => {
      dispatch({ type: MFA_SETUP_SUCCESS, data });
      return data;
    }).catch((error: AxiosError) => {
      dispatch({ type: MFA_SETUP_FAIL });
      throw error;
    });
  };

const confirmMfa = (method: string, code: string, password: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const params = { code, password };
    dispatch({ type: MFA_CONFIRM_REQUEST, method, code });
    return api(getState).post(`/api/pleroma/accounts/mfa/confirm/${method}`, params).then(({ data }) => {
      dispatch({ type: MFA_CONFIRM_SUCCESS, method, code });
      return data;
    }).catch((error: AxiosError) => {
      dispatch({ type: MFA_CONFIRM_FAIL, method, code, error, skipAlert: true });
      throw error;
    });
  };

const disableMfa = (method: string, password: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: MFA_DISABLE_REQUEST, method });
    return api(getState).delete(`/api/pleroma/accounts/mfa/${method}`, { data: { password } }).then(({ data }) => {
      dispatch({ type: MFA_DISABLE_SUCCESS, method });
      return data;
    }).catch((error: AxiosError) => {
      dispatch({ type: MFA_DISABLE_FAIL, method, skipAlert: true });
      throw error;
    });
  };

export {
  MFA_FETCH_REQUEST,
  MFA_FETCH_SUCCESS,
  MFA_FETCH_FAIL,
  MFA_BACKUP_CODES_FETCH_REQUEST,
  MFA_BACKUP_CODES_FETCH_SUCCESS,
  MFA_BACKUP_CODES_FETCH_FAIL,
  MFA_SETUP_REQUEST,
  MFA_SETUP_SUCCESS,
  MFA_SETUP_FAIL,
  MFA_CONFIRM_REQUEST,
  MFA_CONFIRM_SUCCESS,
  MFA_CONFIRM_FAIL,
  MFA_DISABLE_REQUEST,
  MFA_DISABLE_SUCCESS,
  MFA_DISABLE_FAIL,
  fetchMfa,
  fetchBackupCodes,
  setupMfa,
  confirmMfa,
  disableMfa,
};
