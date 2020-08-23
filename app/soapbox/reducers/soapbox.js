import { ADMIN_CONFIG_UPDATE_SUCCESS } from '../actions/admin';
import {
  SOAPBOX_CONFIG_REQUEST_SUCCESS,
  SOAPBOX_CONFIG_REQUEST_FAIL,
} from '../actions/soapbox';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

// TODO: Handle this more like getSettings()
const initialState = ImmutableMap({
  logo: '',
  banner: '',
  brandColor: '#0482d8', // Azure
  customCss: ImmutableList([]),
  promoPanel: ImmutableMap({
    items: ImmutableList([]),
  }),
  extensions: ImmutableMap(),
  defaultSettings: ImmutableMap(),
  copyright: '♥2020. Copying is an act of love. Please copy and share.',
  navlinks: ImmutableMap({
    homeFooter: ImmutableList(),
  }),
});

const updateFromAdmin = (state, config) => {
  // TODO: Generalize this with an API similar to `Pleroma.Config` in Pleroma BE
  const soapboxConfig = config.getIn(['configs', 0, 'value', 0, 'tuple', 1]);
  if (soapboxConfig) return state.mergeDeep(soapboxConfig);
  return state;
};

export default function soapbox(state = initialState, action) {
  switch(action.type) {
  case SOAPBOX_CONFIG_REQUEST_SUCCESS:
    return initialState.mergeDeep(ImmutableMap(fromJS(action.soapboxConfig)));
  case SOAPBOX_CONFIG_REQUEST_FAIL:
    return initialState;
  case ADMIN_CONFIG_UPDATE_SUCCESS:
    return updateFromAdmin(state, fromJS(action.config));
  default:
    return state;
  }
};
