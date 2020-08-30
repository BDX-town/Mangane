import api from '../api';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';

export const SOAPBOX_CONFIG_REQUEST_SUCCESS = 'SOAPBOX_CONFIG_REQUEST_SUCCESS';
export const SOAPBOX_CONFIG_REQUEST_FAIL    = 'SOAPBOX_CONFIG_REQUEST_FAIL';

export const defaultConfig = ImmutableMap({
  logo: '',
  banner: '',
  brandColor: '#0482d8', // Azure
  customCss: ImmutableList(),
  promoPanel: ImmutableMap({
    items: ImmutableList(),
  }),
  extensions: ImmutableMap(),
  defaultSettings: ImmutableMap(),
  copyright: '♥2020. Copying is an act of love. Please copy and share.',
  navlinks: ImmutableMap({
    homeFooter: ImmutableList(),
  }),
});

export function getSoapboxConfig(state) {
  return defaultConfig.mergeDeep(state.get('soapbox'));
}

export function fetchSoapboxConfig() {
  return (dispatch, getState) => {
    api(getState).get('/api/pleroma/frontend_configurations').then(response => {
      if (response.data.soapbox_fe) {
        dispatch(importSoapboxConfig(response.data.soapbox_fe));
      } else {
        dispatch(fetchSoapboxJson());
      }
    }).catch(error => {
      dispatch(fetchSoapboxJson());
    });
  };
}

export function fetchSoapboxJson() {
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
  if (!error.response) {
    console.error('Unable to obtain soapbox configuration: ' + error);
  }
  return {
    type: SOAPBOX_CONFIG_REQUEST_FAIL,
    error,
    skipAlert: true,
  };
}
