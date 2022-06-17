import { Record as ImmutableRecord } from 'immutable';

import {
  STATUS_HOVER_CARD_OPEN,
  STATUS_HOVER_CARD_CLOSE,
  STATUS_HOVER_CARD_UPDATE,
} from 'soapbox/actions/status_hover_card';

import type { AnyAction } from 'redux';

const ReducerRecord = ImmutableRecord({
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
      if (state.get('hovered') === true && !action.force)
        return state;
      else
        return ReducerRecord();
    default:
      return state;
  }
}

