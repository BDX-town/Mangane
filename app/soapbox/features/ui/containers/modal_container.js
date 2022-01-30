import { connect } from 'react-redux';

import { cancelReplyCompose } from '../../../actions/compose';
import { closeModal } from '../../../actions/modal';
import ModalRoot from '../components/modal_root';

const mapStateToProps = state => {
  const modal = state.get('modal').last({
    modalType: null,
    modalProps: {},
  });

  return {
    type: modal.modalType,
    props: modal.modalProps,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClose(type) {
    if (type === 'COMPOSE') {
      dispatch(cancelReplyCompose());
    }

    dispatch(closeModal(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot);
