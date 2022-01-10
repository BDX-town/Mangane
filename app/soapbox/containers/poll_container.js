import { connect } from 'react-redux';

import Poll from 'soapbox/components/poll';

const mapStateToProps = (state, { pollId }) => ({
  poll: state.getIn(['polls', pollId]),
  me: state.get('me'),
});


export default connect(mapStateToProps)(Poll);
