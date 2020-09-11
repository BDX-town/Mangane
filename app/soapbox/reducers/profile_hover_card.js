import { PROFILE_HOVER_CARD_OPEN } from 'soapbox/actions/profile_hover_card';
import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap();

export default function profileHoverCard(state = initialState, action) {
  switch(action.type) {
  case PROFILE_HOVER_CARD_OPEN:
    return ImmutableMap({
      ref: action.ref,
      accountId: action.accountId,
    });
  default:
    return state;
  }
}
