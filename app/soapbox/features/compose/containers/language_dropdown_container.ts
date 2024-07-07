import { connect } from 'react-redux';

import { changeComposeLanguage } from '../../../actions/compose';
import { openModal, closeModal } from '../../../actions/modals';
import { isUserTouching } from '../../../is_mobile';
import LanguageDropdown from '../components/language_dropdown';

const mapStateToProps = state => ({
  isModalOpen: Boolean(state.get('modals').size && state.get('modals').last().modalType === 'ACTIONS'),
  value: state.getIn(['compose', 'language']),
  defaultValue: state.getIn(['settings', 'defaultPostLanguage']),
  unavailable: !!state.getIn(['compose', 'id']),
});

const mapDispatchToProps = dispatch => ({

  onChange(value) {
    dispatch(changeComposeLanguage(value));
  },

  isUserTouching,
  onModalOpen: props => dispatch(openModal('ACTIONS', props)),
  onModalClose: () => {
    dispatch(closeModal('ACTIONS'));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageDropdown);
