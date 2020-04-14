import api from '../api';

export const SOAPBOX_CONFIG_IMPORT  = 'SOAPBOX_CONFIG_IMPORT';
export const SOAPBOX_CONFIG_FAIL    = 'SOAPBOX_CONFIG_FAIL';

export function fetchSoapboxConfig() {
  return (dispatch, getState) => {
    api(getState).get('/soapbox/soapbox.json').then(response => {
      dispatch(importSoapboxConfig(response.data));
    }).catch(error => {
      dispatch(soapboxConfigFail(error));
    });
  };
}

export function importSoapboxConfig(soapboxConfig) {
  return {
    type: SOAPBOX_CONFIG_IMPORT,
    soapboxConfig,
  };
}

export function soapboxConfigFail(error) {
  return {
    type: SOAPBOX_CONFIG_FAIL,
    error,
    skipAlert: true,
  };
};
