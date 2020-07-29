import api from '../api';

export const SOAPBOX_CONFIG_REQUEST_SUCCESS = 'SOAPBOX_CONFIG_REQUEST_SUCCESS';
export const SOAPBOX_CONFIG_REQUEST_FAIL    = 'SOAPBOX_CONFIG_REQUEST_FAIL';

export const SOAPBOX_PATCH_REQUEST = 'SOAPBOX_PATCH_REQUEST';
export const SOAPBOX_PATCH_SUCCESS = 'SOAPBOX_PATCH_SUCCESS';
export const SOAPBOX_PATCH_FAIL    = 'SOAPBOX_PATCH_FAIL';

export function fetchSoapboxConfig() {
  return (dispatch, getState) => {
    api(getState).get('/api/pleroma/frontend_configurations').then(response => {
      if (response.data.soapbox_fe) {
        dispatch(importSoapboxConfig(response.data.soapbox_fe));
      } else {
        api(getState).get('/instance/soapbox.json').then(response => {
          dispatch(importSoapboxConfig(response.data));
        }).catch(error => {
          dispatch(soapboxConfigFail(error));
        });
      }
    }).catch(error => {
      api(getState).get('/instance/soapbox.json').then(response => {
        dispatch(importSoapboxConfig(response.data));
      }).catch(error => {
        dispatch(soapboxConfigFail(error));
      });
    });
  };
}

export function importSoapboxConfig(soapboxConfig) {
  return {
    type: SOAPBOX_CONFIG_REQUEST_SUCCESS,
    soapboxConfig,
  };
}

export function soapboxConfigFail(error) {
  if (!error.response) {
    console.error('Unable to obtain soapbox configuration: ' + error);
  }
  return {
    type: SOAPBOX_CONFIG_REQUEST_FAIL,
    error,
    skipAlert: true,
  };
}

export function patchSoapbox(params) {
  console.log(params);
  return (dispatch, getState) => {
    dispatch(patchSoapboxRequest());
    return api(getState)
      .patch('/api/pleroma/admin/config', params)
      .then(response => {
        dispatch(patchSoapboxSuccess(response.data));
      }).catch(error => {
        dispatch(patchSoapboxFail(error));
      });
  };
}

export function patchSoapboxRequest() {
  return {
    type: SOAPBOX_PATCH_REQUEST,
  };
}

export function patchSoapboxSuccess(me) {
  return (dispatch, getState) => {
    dispatch({
      type: SOAPBOX_PATCH_SUCCESS,
      me,
    });
  };
}

export function patchSoapboxFail(error) {
  return {
    type: SOAPBOX_PATCH_FAIL,
    error,
  };
};
