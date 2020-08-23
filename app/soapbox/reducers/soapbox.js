import { ADMIN_CONFIG_UPDATE_SUCCESS } from '../actions/admin';
import { SOAPBOX_CONFIG_REQUEST_SUCCESS } from '../actions/soapbox';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const updateFromAdmin = (state, config) => {
  // TODO: Generalize this with an API similar to `Pleroma.Config` in Pleroma BE
  const soapboxConfig = config.getIn(['configs', 0, 'value', 0, 'tuple', 1]);
  if (soapboxConfig) return state.mergeDeep(soapboxConfig);
  return state;
};

export default function soapbox(state = initialState, action) {
  switch(action.type) {
  case SOAPBOX_CONFIG_REQUEST_SUCCESS:
    return fromJS(action.soapboxConfig);
  case ADMIN_CONFIG_UPDATE_SUCCESS:
    return updateFromAdmin(state, fromJS(action.config));
  default:
    return state;
  }
};
