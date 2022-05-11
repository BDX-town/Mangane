import { Map as ImmutableMap, fromJS } from 'immutable';

import { PLEROMA_PRELOAD_IMPORT } from 'soapbox/actions/preload';
import KVStore from 'soapbox/storage/kv_store';
import { ConfigDB } from 'soapbox/utils/config_db';

import { ADMIN_CONFIG_UPDATE_SUCCESS } from '../actions/admin';
import {
  SOAPBOX_CONFIG_REMEMBER_SUCCESS,
  SOAPBOX_CONFIG_REQUEST_SUCCESS,
  SOAPBOX_CONFIG_REQUEST_FAIL,
} from '../actions/soapbox';

const initialState = ImmutableMap();

const fallbackState = ImmutableMap({
  brandColor: '#0482d8', // Azure
});

const updateFromAdmin = (state, configs) => {
  try {
    return ConfigDB.find(configs, ':pleroma', ':frontend_configurations')
      .get('value')
      .find(value => value.getIn(['tuple', 0]) === ':soapbox_fe')
      .getIn(['tuple', 1]);
  } catch {
    return state;
  }
};

const preloadImport = (state, action) => {
  const path = '/api/pleroma/frontend_configurations';
  const feData = action.data[path];

  if (feData) {
    const soapbox = feData.soapbox_fe;
    return soapbox ? fallbackState.mergeDeep(fromJS(soapbox)) : fallbackState;
  } else {
    return state;
  }
};

const persistSoapboxConfig = (soapboxConfig, host) => {
  if (host) {
    KVStore.setItem(`soapbox_config:${host}`, soapboxConfig.toJS()).catch(console.error);
  }
};

const importSoapboxConfig = (state, soapboxConfig, host) => {
  persistSoapboxConfig(soapboxConfig, host);
  return soapboxConfig;
};

export default function soapbox(state = initialState, action) {
  switch (action.type) {
    case PLEROMA_PRELOAD_IMPORT:
      return preloadImport(state, action);
    case SOAPBOX_CONFIG_REMEMBER_SUCCESS:
      return fromJS(action.soapboxConfig);
    case SOAPBOX_CONFIG_REQUEST_SUCCESS:
      return importSoapboxConfig(state, fromJS(action.soapboxConfig), action.host);
    case SOAPBOX_CONFIG_REQUEST_FAIL:
      return fallbackState.mergeDeep(state);
    case ADMIN_CONFIG_UPDATE_SUCCESS:
      return updateFromAdmin(state, fromJS(action.configs));
    default:
      return state;
  }
}
