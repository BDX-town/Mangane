import api from '../api';

export const ADMIN_CONFIG_UPDATE_REQUEST = 'ADMIN_CONFIG_UPDATE_REQUEST';
export const ADMIN_CONFIG_UPDATE_SUCCESS = 'ADMIN_CONFIG_UPDATE_SUCCESS';
export const ADMIN_CONFIG_UPDATE_FAIL    = 'ADMIN_CONFIG_UPDATE_FAIL';

export const ADMIN_REPORTS_FETCH_REQUEST = 'ADMIN_REPORTS_FETCH_REQUEST';
export const ADMIN_REPORTS_FETCH_SUCCESS = 'ADMIN_REPORTS_FETCH_SUCCESS';
export const ADMIN_REPORTS_FETCH_FAIL    = 'ADMIN_REPORTS_FETCH_FAIL';

export function updateAdminConfig(params) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_CONFIG_UPDATE_REQUEST });
    return api(getState)
      .post('/api/pleroma/admin/config', params)
      .then(response => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_SUCCESS, config: response.data });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_FAIL, error });
      });
  };
}

export function fetchReports(params) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_REPORTS_FETCH_REQUEST, params });
    return api(getState)
      .get('/api/pleroma/admin/reports', { params })
      .then(({ data }) => {
        dispatch({ type: ADMIN_REPORTS_FETCH_SUCCESS, data, params });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_FETCH_FAIL, error, params });
      });
  };
}
