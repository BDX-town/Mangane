import api from '../api';

export const SOAPBOX_CONFIG_REQUEST_SUCCESS = 'SOAPBOX_CONFIG_REQUEST_SUCCESS';
export const SOAPBOX_CONFIG_REQUEST_FAIL    = 'SOAPBOX_CONFIG_REQUEST_FAIL';

export const SOAPBOX_POST_REQUEST = 'SOAPBOX_POST_REQUEST';
export const SOAPBOX_POST_SUCCESS = 'SOAPBOX_POST_SUCCESS';
export const SOAPBOX_POST_FAIL    = 'SOAPBOX_POST_FAIL';

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

export function postSoapbox(params) {
  return (dispatch, getState) => {
    dispatch(postSoapboxRequest());
    return api(getState)
      .post('/api/pleroma/admin/config', params)
      .then(response => {
        dispatch(postSoapboxSuccess(response.data));
      }).catch(error => {
        dispatch(postSoapboxFail(error));
      });
  };
}

export function postSoapboxRequest() {
  return {
    type: SOAPBOX_POST_REQUEST,
  };
}

export function postSoapboxSuccess(soapboxConfig) {
  return {
    type: SOAPBOX_POST_SUCCESS,
    soapboxConfig,
  };
}

export function postSoapboxFail(error) {
  return {
    type: SOAPBOX_POST_FAIL,
    error,
  };
};
