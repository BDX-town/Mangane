import { ADMIN_CONFIG_UPDATE_SUCCESS } from '../actions/admin';
import {
  SOAPBOX_CONFIG_REQUEST_SUCCESS,
  SOAPBOX_CONFIG_REQUEST_FAIL,
} from '../actions/soapbox';
import { PLEROMA_PRELOAD_IMPORT } from 'soapbox/actions/preload';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { ConfigDB } from 'soapbox/utils/config_db';

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

export default function soapbox(state = initialState, action) {
  switch(action.type) {
  case PLEROMA_PRELOAD_IMPORT:
    return preloadImport(state, action);
  case SOAPBOX_CONFIG_REQUEST_SUCCESS:
    return fromJS(action.soapboxConfig);
  case SOAPBOX_CONFIG_REQUEST_FAIL:
    return fallbackState.mergeDeep(state);
  case ADMIN_CONFIG_UPDATE_SUCCESS:
    return updateFromAdmin(state, fromJS(action.configs));
  default:
    return state;
  }
}
