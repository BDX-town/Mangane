import { createSelector } from 'reselect';

import { getHost } from 'soapbox/actions/instance';
import { normalizeSoapboxConfig } from 'soapbox/normalizers';
import KVStore from 'soapbox/storage/kv_store';
import { removeVS16s } from 'soapbox/utils/emoji';
import { getFeatures } from 'soapbox/utils/features';

import api, { staticClient } from '../api';

export const SOAPBOX_CONFIG_REQUEST_SUCCESS = 'SOAPBOX_CONFIG_REQUEST_SUCCESS';
export const SOAPBOX_CONFIG_REQUEST_FAIL    = 'SOAPBOX_CONFIG_REQUEST_FAIL';

export const SOAPBOX_CONFIG_REMEMBER_REQUEST = 'SOAPBOX_CONFIG_REMEMBER_REQUEST';
export const SOAPBOX_CONFIG_REMEMBER_SUCCESS = 'SOAPBOX_CONFIG_REMEMBER_SUCCESS';
export const SOAPBOX_CONFIG_REMEMBER_FAIL    = 'SOAPBOX_CONFIG_REMEMBER_FAIL';

export const getSoapboxConfig = createSelector([
  state => state.soapbox,
  state => getFeatures(state.instance),
], (soapbox, features) => {
  // Do some additional normalization with the state
  return normalizeSoapboxConfig(soapbox).withMutations(soapboxConfig => {

    // If displayFqn isn't set, infer it from federation
    if (soapbox.get('displayFqn') === undefined) {
      soapboxConfig.set('displayFqn', features.federating);
    }

    // If RGI reacts aren't supported, strip VS16s
    // // https://git.pleroma.social/pleroma/pleroma/-/issues/2355
    if (!features.emojiReactsRGI) {
      soapboxConfig.set('allowedEmoji', soapboxConfig.allowedEmoji.map(removeVS16s));
    }
  });
});

export function rememberSoapboxConfig(host) {
  return (dispatch, getState) => {
    dispatch({ type: SOAPBOX_CONFIG_REMEMBER_REQUEST, host });
    return KVStore.getItemOrError(`soapbox_config:${host}`).then(soapboxConfig => {
      dispatch({ type: SOAPBOX_CONFIG_REMEMBER_SUCCESS, host, soapboxConfig });
      return soapboxConfig;
    }).catch(error => {
      dispatch({ type: SOAPBOX_CONFIG_REMEMBER_FAIL, host, error, skipAlert: true });
    });
  };
}

export function fetchFrontendConfigurations() {
  return (dispatch, getState) => {
    return api(getState)
      .get('/api/pleroma/frontend_configurations')
      .then(({ data }) => data);
  };
}

/** Conditionally fetches Soapbox config depending on backend features */
export function fetchSoapboxConfig(host) {
  return (dispatch, getState) => {
    const features = getFeatures(getState().instance);

    if (features.frontendConfigurations) {
      return dispatch(fetchFrontendConfigurations()).then(data => {
        if (data.soapbox_fe) {
          dispatch(importSoapboxConfig(data.soapbox_fe, host));
        } else {
          dispatch(fetchSoapboxJson(host));
        }
      });
    } else {
      return dispatch(fetchSoapboxJson(host));
    }
  };
}

/** Tries to remember the config from browser storage before fetching it */
export function loadSoapboxConfig() {
  return (dispatch, getState) => {
    const host = getHost(getState());

    return dispatch(rememberSoapboxConfig(host)).finally(() => {
      return dispatch(fetchSoapboxConfig(host));
    });
  };
}

export function fetchSoapboxJson(host) {
  return (dispatch, getState) => {
    staticClient.get('/instance/soapbox.json').then(({ data }) => {
      if (!isObject(data)) throw 'soapbox.json failed';
      dispatch(importSoapboxConfig(data, host));
    }).catch(error => {
      dispatch(soapboxConfigFail(error, host));
    });
  };
}

export function importSoapboxConfig(soapboxConfig, host) {
  if (!soapboxConfig.brandColor) {
    soapboxConfig.brandColor = '#0482d8';
  }
  return {
    type: SOAPBOX_CONFIG_REQUEST_SUCCESS,
    soapboxConfig,
    host,
  };
}

export function soapboxConfigFail(error, host) {
  return {
    type: SOAPBOX_CONFIG_REQUEST_FAIL,
    error,
    skipAlert: true,
    host,
  };
}

// https://stackoverflow.com/a/46663081
function isObject(o) {
  return o instanceof Object && o.constructor === Object;
}
