import { connect } from 'react-redux';
import { closeModal } from '../../../actions/modal';
import { cancelReplyCompose } from '../../../actions/compose';
import ModalRoot from '../components/modal_root';

const mapStateToProps = state => ({
  type: state.get('modal').modalType,
  props: state.get('modal').modalProps,
});

const mapDispatchToProps = (dispatch) => ({
  onClose (optionalType) {
    if (optionalType === 'COMPOSE') {
        dispatch(cancelReplyCompose());
    }

    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot);
