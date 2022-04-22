import { connect } from 'react-redux';

import { openDropdownMenu, closeDropdownMenu } from '../actions/dropdown_menu';
import { openModal, closeModal } from '../actions/modals';
import DropdownMenu from '../components/dropdown_menu';
import { isUserTouching } from '../is_mobile';

const mapStateToProps = state => ({
  isModalOpen: state.get('modals').size && state.get('modals').last().modalType === 'ACTIONS',
  dropdownPlacement: state.getIn(['dropdown_menu', 'placement']),
  openDropdownId: state.getIn(['dropdown_menu', 'openId']),
  openedViaKeyboard: state.getIn(['dropdown_menu', 'keyboard']),
});

const mapDispatchToProps = (dispatch, { status, items }) => ({
  onOpen(id, onItemClick, dropdownPlacement, keyboard) {
    dispatch(isUserTouching() ? openModal('ACTIONS', {
      status,
      actions: items,
      onClick: onItemClick,
    }) : openDropdownMenu(id, dropdownPlacement, keyboard));
  },
  onClose(id) {
    dispatch(closeModal('ACTIONS'));
    dispatch(closeDropdownMenu(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DropdownMenu);
