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
    colors: ImmutableMap({
      gray: ImmutableMap({
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      }),
      success: ImmutableMap({
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      }),
      danger: ImmutableMap({
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      }),
      'gradient-purple': '#b8a3f9',
      'gradient-blue': '#9bd5ff',
      'sea-blue': '#2feecc',
    }),
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
  const defaultConfig = makeDefaultConfig(features);
  return soapbox.mergeDeepWith((o, n) => o || n, defaultConfig);
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
