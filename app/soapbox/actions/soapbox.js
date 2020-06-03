import api from '../api';

export const SOAPBOX_CONFIG_REQUEST_SUCCESS = 'SOAPBOX_CONFIG_REQUEST_SUCCESS';
export const SOAPBOX_CONFIG_REQUEST_FAIL    = 'SOAPBOX_CONFIG_REQUEST_FAIL';

export function fetchSoapboxConfig() {
  return (dispatch, getState) => {
    api(getState).get('/instance/soapbox.json').then(response => {
      dispatch(importSoapboxConfig(response.data));
    }).catch(error => {
      dispatch(soapboxConfigFail(error));
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
  return {
    type: SOAPBOX_CONFIG_REQUEST_FAIL,
    error,
    skipAlert: true,
  };
};
