import { connect } from 'react-redux';

import { cancelQuoteCompose } from 'soapbox/actions/compose';
import QuotedStatus from 'soapbox/features/status/components/quoted_status';
import { makeGetStatus } from 'soapbox/selectors';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = state => ({
    status: getStatus(state, { id: state.getIn(['compose', 'quote']) }),
    compose: true,
  });

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({

  onCancel() {
    dispatch(cancelQuoteCompose());
  },

});

export default connect(makeMapStateToProps, mapDispatchToProps)(QuotedStatus);