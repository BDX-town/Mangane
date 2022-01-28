import { connect } from 'react-redux';

import { changeComposeVisibility } from '../../../actions/compose';
import { openModal, closeModal } from '../../../actions/modal';
import { isUserTouching } from '../../../is_mobile';
import PrivacyDropdown from '../components/privacy_dropdown';

const mapStateToProps = state => ({
  isModalOpen: state.get('modal').modalType === 'ACTIONS',
  value: state.getIn(['compose', 'privacy']),
});

const mapDispatchToProps = dispatch => ({

  onChange(value) {
    dispatch(changeComposeVisibility(value));
  },

  isUserTouching,
  onModalOpen: props => dispatch(openModal('ACTIONS', props)),
  onModalClose: () => {
    dispatch(closeModal());
    dispatch(openModal('COMPOSE'));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyDropdown);
