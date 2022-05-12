import { connect } from 'react-redux';

import { cancelReport } from 'soapbox/actions/reports';

import { cancelReplyCompose } from '../../../actions/compose';
import { closeModal } from '../../../actions/modals';
import ModalRoot from '../components/modal_root';

const mapStateToProps = state => {
  const modal = state.get('modals').last({
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
    switch (type) {
      case 'COMPOSE':
        dispatch(cancelReplyCompose());
        break;
      case 'REPORT':
        dispatch(cancelReport());
        break;
      default:
        break;
    }

    dispatch(closeModal(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot);
