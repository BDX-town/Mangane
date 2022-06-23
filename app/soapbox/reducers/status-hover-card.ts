import { Record as ImmutableRecord } from 'immutable';

import {
  STATUS_HOVER_CARD_OPEN,
  STATUS_HOVER_CARD_CLOSE,
  STATUS_HOVER_CARD_UPDATE,
} from 'soapbox/actions/status-hover-card';

import type { AnyAction } from 'redux';

export const ReducerRecord = ImmutableRecord({
  ref: null as React.MutableRefObject<HTMLDivElement> | null,
  statusId: '',
  hovered: false,
});

type State = ReturnType<typeof ReducerRecord>;

export default function statusHoverCard(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case STATUS_HOVER_CARD_OPEN:
      return state.withMutations((state) => {
        state.set('ref', action.ref);
        state.set('statusId', action.statusId);
      });
    case STATUS_HOVER_CARD_UPDATE:
      return state.set('hovered', true);
    case STATUS_HOVER_CARD_CLOSE:
      if (state.hovered === true && !action.force)
        return state;
      else
        return ReducerRecord();
    default:
      return state;
  }
}
