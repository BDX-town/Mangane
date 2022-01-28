import { connect } from 'react-redux';

import { cancelReplyCompose } from '../../../actions/compose';
import { closeModal } from '../../../actions/modal';
import ModalRoot from '../components/modal_root';

const mapStateToProps = state => ({
  type: state.get('modal').modalType,
  props: state.get('modal').modalProps,
  noPop: state.get('modal').noPop,
});

const mapDispatchToProps = (dispatch) => ({
  onClose(optionalType, noPop) {
    if (optionalType === 'COMPOSE') {
      dispatch(cancelReplyCompose());
    }

    dispatch(closeModal(undefined, noPop));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot);
