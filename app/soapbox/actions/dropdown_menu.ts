import type { DropdownPlacement } from 'soapbox/components/dropdown_menu';

const DROPDOWN_MENU_OPEN = 'DROPDOWN_MENU_OPEN';
const DROPDOWN_MENU_CLOSE = 'DROPDOWN_MENU_CLOSE';

const openDropdownMenu = (id: number, placement: DropdownPlacement, keyboard: boolean) =>
  ({ type: DROPDOWN_MENU_OPEN, id, placement, keyboard });

const closeDropdownMenu = (id: number) =>
  ({ type: DROPDOWN_MENU_CLOSE, id });

export {
  DROPDOWN_MENU_OPEN,
  DROPDOWN_MENU_CLOSE,
  openDropdownMenu,
  closeDropdownMenu,
};
