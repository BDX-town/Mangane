import { connect } from 'react-redux';

import { openDropdownMenu, closeDropdownMenu } from '../actions/dropdown_menu';
import { openModal, closeModal } from '../actions/modals';
import DropdownMenu from '../components/dropdown_menu';
import { isUserTouching } from '../is_mobile';

import type { Dispatch } from 'redux';
import type { DropdownPlacement, IDropdown } from 'soapbox/components/dropdown_menu';
import type { RootState } from 'soapbox/store';

const mapStateToProps = (state: RootState) => ({
  isModalOpen: Boolean(state.modals.size && state.modals.last().modalType === 'ACTIONS'),
  dropdownPlacement: state.dropdown_menu.get('placement'),
  openDropdownId: state.dropdown_menu.get('openId'),
  openedViaKeyboard: state.dropdown_menu.get('keyboard'),
});

const mapDispatchToProps = (dispatch: Dispatch, { status, items }: Partial<IDropdown>) => ({
  onOpen(
    id: number,
    onItemClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
    dropdownPlacement: DropdownPlacement,
    keyboard: boolean,
  ) {
    dispatch(isUserTouching() ? openModal('ACTIONS', {
      status,
      actions: items,
      onClick: onItemClick,
    }) : openDropdownMenu(id, dropdownPlacement, keyboard));
  },
  onClose(id: number) {
    dispatch(closeModal('ACTIONS'));
    dispatch(closeDropdownMenu(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DropdownMenu);
