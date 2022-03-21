import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { createSelector } from 'reselect';

import { getHost } from 'soapbox/actions/instance';
import KVStore from 'soapbox/storage/kv_store';
import { getFeatures } from 'soapbox/utils/features';

import api, { staticClient } from '../api';

export const SOAPBOX_CONFIG_REQUEST_SUCCESS = 'SOAPBOX_CONFIG_REQUEST_SUCCESS';
export const SOAPBOX_CONFIG_REQUEST_FAIL    = 'SOAPBOX_CONFIG_REQUEST_FAIL';

export const SOAPBOX_CONFIG_REMEMBER_REQUEST = 'SOAPBOX_CONFIG_REMEMBER_REQUEST';
export const SOAPBOX_CONFIG_REMEMBER_SUCCESS = 'SOAPBOX_CONFIG_REMEMBER_SUCCESS';
export const SOAPBOX_CONFIG_REMEMBER_FAIL    = 'SOAPBOX_CONFIG_REMEMBER_FAIL';

const allowedEmoji = ImmutableList([
  '👍',
  '❤',
  '😆',
  '😮',
  '😢',
  '😩',
]);

// https://git.pleroma.social/pleroma/pleroma/-/issues/2355
const allowedEmojiRGI = ImmutableList([
  '👍',
  '❤️',
  '😆',
  '😮',
  '😢',
  '😩',
]);

const year = new Date().getFullYear();

export const makeDefaultConfig = features => {
  return ImmutableMap({
    logo: '',
    banner: '',
    brandColor: '', // Empty
    accentColor: '',
    customCss: ImmutableList(),
    promoPanel: ImmutableMap({
      items: ImmutableList(),
    }),
    extensions: ImmutableMap(),
    defaultSettings: ImmutableMap(),
    copyright: `♥${year}. Copying is an act of love. Please copy and share.`,
    navlinks: ImmutableMap({
      homeFooter: ImmutableList(),
    }),
    allowedEmoji: features.emojiReactsRGI ? allowedEmojiRGI : allowedEmoji,
    verifiedIcon: '',
    verifiedCanEditName: false,
    displayFqn: Boolean(features.federating),
    cryptoAddresses: ImmutableList(),
    cryptoDonatePanel: ImmutableMap({
      limit: 1,
    }),
    aboutPages: ImmutableMap(),
    betaPages: ImmutableMap(),
    mobilePages: ImmutableMap(),
    authenticatedProfile: true,
    singleUserMode: false,
    singleUserModeProfile: '',
  });
};

export const getSoapboxConfig = createSelector([
  state => state.get('soapbox'),
  state => getFeatures(state.get('instance')),
], (soapbox, features) => {
  return makeDefaultConfig(features).merge(soapbox);
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

export function fetchSoapboxConfig(host) {
  return (dispatch, getState) => {
    api(getState).get('/api/pleroma/frontend_configurations').then(response => {
      if (response.data.soapbox_fe) {
        dispatch(importSoapboxConfig(response.data.soapbox_fe, host));
      } else {
        dispatch(fetchSoapboxJson(host));
      }
    }).catch(error => {
      dispatch(fetchSoapboxJson(host));
    });
  };
}

// Tries to remember the config from browser storage before fetching it
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
