import { connect } from 'react-redux';

import { makeGetStatus } from 'soapbox/selectors';

import QuotedStatus from '../components/quoted_status';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => ({
    status: getStatus(state, { id: props.statusId }),
  });

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(QuotedStatus);