import { connect } from 'react-redux';

import { changeComposeVisibility } from '../../../actions/compose';
import { openModal, closeModal } from '../../../actions/modals';
import { isUserTouching } from '../../../is_mobile';
import PrivacyDropdown from '../components/privacy_dropdown';

const mapStateToProps = state => ({
  isModalOpen: Boolean(state.get('modals').size && state.get('modals').last().modalType === 'ACTIONS'),
  value: state.getIn(['compose', 'privacy']),
  unavailable: !!state.getIn(['compose', 'id']),
});

const mapDispatchToProps = dispatch => ({

  onChange(value) {
    dispatch(changeComposeVisibility(value));
  },

  isUserTouching,
  onModalOpen: props => dispatch(openModal('ACTIONS', props)),
  onModalClose: () => {
    dispatch(closeModal('ACTIONS'));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyDropdown);
