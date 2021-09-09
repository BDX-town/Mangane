import { connect } from 'react-redux';
import { makeGetAccount } from 'soapbox/selectors';
import FollowRequest from '../components/follow_request';
import { authorizeFollowRequest, rejectFollowRequest } from 'soapbox/actions/accounts';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, props) => ({
    account: getAccount(state, props.id),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { id }) => ({
  onAuthorize() {
    dispatch(authorizeFollowRequest(id));
  },

  onReject() {
    dispatch(rejectFollowRequest(id));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(FollowRequest);
