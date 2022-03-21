import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';

import { mentionCompose } from '../../../actions/compose';
import {
  reblog,
  favourite,
  unreblog,
  unfavourite,
} from '../../../actions/interactions';
import { openModal } from '../../../actions/modals';
import {
  hideStatus,
  revealStatus,
} from '../../../actions/statuses';
import { makeGetNotification } from '../../../selectors';
import Notification from '../components/notification';

const makeMapStateToProps = () => {
  const getNotification = makeGetNotification();

  const mapStateToProps = (state, props) => {
    return {
      siteTitle: state.getIn(['instance', 'title']),
      notification: getNotification(state, props.notification),
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({
  onMention: (account, router) => {
    dispatch(mentionCompose(account, router));
  },

  onModalReblog(status) {
    dispatch(reblog(status));
  },

  onReblog(status, e) {
    dispatch((_, getState) => {
      const boostModal = getSettings(getState()).get('boostModal');
      if (status.get('reblogged')) {
        dispatch(unreblog(status));
      } else {
        if (e.shiftKey || !boostModal) {
          this.onModalReblog(status);
        } else {
          dispatch(openModal('BOOST', { status, onReblog: this.onModalReblog }));
        }
      }
    });
  },

  onFavourite(status) {
    if (status.get('favourited')) {
      dispatch(unfavourite(status));
    } else {
      dispatch(favourite(status));
    }
  },

  onToggleHidden(status) {
    if (status.get('hidden')) {
      dispatch(revealStatus(status.get('id')));
    } else {
      dispatch(hideStatus(status.get('id')));
    }
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(Notification);
