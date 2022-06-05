import { Record as ImmutableRecord } from 'immutable';

import {
  DROPDOWN_MENU_OPEN,
  DROPDOWN_MENU_CLOSE,
} from '../actions/dropdown_menu';

import type { AnyAction } from 'redux';
import type { DropdownPlacement } from 'soapbox/components/dropdown_menu';

const ReducerRecord = ImmutableRecord({
  openId: null as number | null,
  placement: null as any as DropdownPlacement,
  keyboard: false,
});

type State = ReturnType<typeof ReducerRecord>;

export default function dropdownMenu(state: State = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case DROPDOWN_MENU_OPEN:
      return state.merge({ openId: action.id, placement: action.placement, keyboard: action.keyboard });
    case DROPDOWN_MENU_CLOSE:
      return state.openId === action.id ? state.set('openId', null) : state;
    default:
      return state;
  }
}
