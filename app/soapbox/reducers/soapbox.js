import { SOAPBOX_CONFIG_IMPORT } from '../actions/soapbox';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap({
  brandColor: '#0482d8', // Azure
});

export default function soapbox(state = initialState, action) {
  switch(action.type) {
  case SOAPBOX_CONFIG_IMPORT:
    return initialState.merge(ImmutableMap(fromJS(action.soapboxConfig)));
  default:
    return state;
  }
};
