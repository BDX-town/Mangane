import { connect } from 'react-redux';

import { cancelReplyCompose } from '../../../actions/compose';
import { makeGetStatus } from '../../../selectors';
import ReplyIndicator from '../components/reply_indicator';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = state => {
    const statusId = state.getIn(['compose', 'in_reply_to']);
    const editing = !!state.getIn(['compose', 'id']);

    return {
      status: getStatus(state, { id: statusId }),
      hideActions: editing,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({

  onCancel() {
    dispatch(cancelReplyCompose());
  },

});

export default connect(makeMapStateToProps, mapDispatchToProps)(ReplyIndicator);
