import { INSTANCE_IMPORT } from '../actions/instance';
import { Map as ImmutableMap, fromJS } from 'immutable';

// Set Mastodon defaults, overridden by Pleroma servers
const initialState = ImmutableMap({
  max_toot_chars: 500,
  poll_limits: ImmutableMap({
    max_expiration: 2629746,
    max_option_chars: 25,
    max_options: 4,
    min_expiration: 300,
  }),
});

export default function instance(state = initialState, action) {
  switch(action.type) {
  case INSTANCE_IMPORT:
    return ImmutableMap(fromJS(action.instance));
  default:
    return state;
  }
};
