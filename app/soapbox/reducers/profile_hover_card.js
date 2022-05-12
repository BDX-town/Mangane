import { Map as ImmutableMap } from 'immutable';

import {
  PROFILE_HOVER_CARD_OPEN,
  PROFILE_HOVER_CARD_CLOSE,
  PROFILE_HOVER_CARD_UPDATE,
} from 'soapbox/actions/profile_hover_card';

const initialState = ImmutableMap();

export default function profileHoverCard(state = initialState, action) {
  switch (action.type) {
    case PROFILE_HOVER_CARD_OPEN:
      return ImmutableMap({
        ref: action.ref,
        accountId: action.accountId,
      });
    case PROFILE_HOVER_CARD_UPDATE:
      return state.set('hovered', true);
    case PROFILE_HOVER_CARD_CLOSE:
      if (state.get('hovered') === true && !action.force)
        return state;
      else
        return ImmutableMap();
    default:
      return state;
  }
}
