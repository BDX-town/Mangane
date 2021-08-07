import api from '../api';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { getFeatures } from 'soapbox/utils/features';
import { createSelector } from 'reselect';

export const SOAPBOX_CONFIG_REQUEST_SUCCESS = 'SOAPBOX_CONFIG_REQUEST_SUCCESS';
export const SOAPBOX_CONFIG_REQUEST_FAIL    = 'SOAPBOX_CONFIG_REQUEST_FAIL';

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

export const defaultConfig = ImmutableMap({
  logo: '',
  banner: '',
  brandColor: '', // Empty
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
  allowedEmoji: allowedEmoji,
  verifiedCanEditName: false,
  displayFqn: true,
  cryptoAddresses: ImmutableList(),
  cryptoDonatePanel: ImmutableMap({
    limit: 1,
  }),
  aboutPages: ImmutableMap(),
});

export const getSoapboxConfig = createSelector([
  state => state.get('soapbox'),
  state => getFeatures(state.get('instance')).emojiReactsRGI,
], (soapbox, emojiReactsRGI) => {
  // https://git.pleroma.social/pleroma/pleroma/-/issues/2355
  if (emojiReactsRGI) {
    return defaultConfig
      .set('allowedEmoji', allowedEmojiRGI)
      .merge(soapbox);
  } else {
    return defaultConfig.merge(soapbox);
  }
});

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
    api(getState).get('/instance/soapbox.json').then(({ data }) => {
      if (!isObject(data)) throw 'soapbox.json failed';
      dispatch(importSoapboxConfig(data));
    }).catch(error => {
      dispatch(soapboxConfigFail(error));
    });
  };
}

export function importSoapboxConfig(soapboxConfig) {
  if (!soapboxConfig.brandColor) {
    soapboxConfig.brandColor = '#0482d8';
  }
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
}

// https://stackoverflow.com/a/46663081
function isObject(o) {
  return o instanceof Object && o.constructor === Object;
}
