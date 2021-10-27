import { connect } from 'react-redux';
import { openModal } from 'soapbox/actions/modal';
import Poll from 'soapbox/components/poll';

const mapStateToProps = (state, { pollId }) => ({
  poll: state.getIn(['polls', pollId]),
  me: state.get('me'),
});

const mapDispatchToProps = (dispatch) => ({
  onOpenUnauthorizedModal() {
    dispatch(openModal('UNAUTHORIZED'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Poll);
