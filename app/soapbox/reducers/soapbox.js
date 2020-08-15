import {
  SOAPBOX_CONFIG_REQUEST_SUCCESS,
  SOAPBOX_CONFIG_REQUEST_FAIL,
  SOAPBOX_POST_SUCCESS,
} from '../actions/soapbox';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap();

const defaultState = ImmutableMap({
  logo: '',
  banner: '',
  brandColor: '#0482d8', // Azure
  customCss: ImmutableList([]),
  promoPanel: ImmutableMap({
    items: ImmutableList([]),
  }),
  extensions: ImmutableMap({
    patron: false,
  }),
  defaultSettings: ImmutableMap({
    autoPlayGif: false,
  }),
  copyright: '♥2020. Copying is an act of love. Please copy and share.',
  navlinks: ImmutableMap({
    homeFooter: ImmutableList([]),
  }),
});

export default function soapbox(state = initialState, action) {
  switch(action.type) {
  case SOAPBOX_CONFIG_REQUEST_SUCCESS:
    return defaultState.merge(ImmutableMap(fromJS(action.soapboxConfig)));
  case SOAPBOX_CONFIG_REQUEST_FAIL:
    return defaultState;
  case SOAPBOX_POST_SUCCESS:
    return defaultState.merge(ImmutableMap(fromJS(action.soapboxConfig.configs[0].value[0].tuple[1])));
  default:
    return state;
  }
};
