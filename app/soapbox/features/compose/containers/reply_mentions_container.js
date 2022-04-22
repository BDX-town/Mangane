import { connect } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { statusToMentionsAccountIdsArray } from 'soapbox/reducers/compose';
import { makeGetStatus } from 'soapbox/selectors';
import { getFeatures } from 'soapbox/utils/features';

import ReplyMentions from '../components/reply_mentions';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  return state => {
    const instance = state.get('instance');
    const { explicitAddressing } = getFeatures(instance);

    if (!explicitAddressing) {
      return {
        explicitAddressing: false,
      };
    }

    const status = getStatus(state, { id: state.getIn(['compose', 'in_reply_to']) });

    if (!status) {
      return {
        isReply: false,
      };
    }
    const to = state.getIn(['compose', 'to']);

    const me = state.get('me');
    const account = state.getIn(['accounts', me]);

    const parentTo = statusToMentionsAccountIdsArray(state, status, account);

    return {
      to,
      parentTo,
      isReply: true,
      explicitAddressing: true,
    };
  };
};

const mapDispatchToProps = dispatch => ({
  onOpenMentionsModal() {
    dispatch(openModal('REPLY_MENTIONS'));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(ReplyMentions);
