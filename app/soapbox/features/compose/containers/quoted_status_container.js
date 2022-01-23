import { connect } from 'react-redux';

import QuotedStatus from 'soapbox/features/status/components/quoted_status';
import { makeGetStatus } from 'soapbox/selectors';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = state => ({
    status: getStatus(state, { id: state.getIn(['compose', 'quote']) }),
  });

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(QuotedStatus);