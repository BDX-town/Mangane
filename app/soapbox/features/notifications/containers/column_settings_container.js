import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ColumnSettings from '../components/column_settings';
import { getSettings, changeSetting } from '../../../actions/settings';
import { setFilter } from '../../../actions/notifications';
import { clearNotifications } from '../../../actions/notifications';
import { changeAlerts as changePushNotifications } from '../../../actions/push_notifications';
import { openModal } from '../../../actions/modal';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  clearMessage: { id: 'notifications.clear_confirmation', defaultMessage: 'Are you sure you want to permanently clear all your notifications?' },
  clearConfirm: { id: 'notifications.clear', defaultMessage: 'Clear notifications' },
});

const mapStateToProps = state => {
  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    settings: getSettings(state).get('notifications'),
    pushSettings: state.get('push_notifications'),
    supportsEmojiReacts: features.emojiReacts,
  };
};

const mapDispatchToProps = (dispatch, { intl }) => ({

  onChange(path, checked) {
    if (path[0] === 'push') {
      dispatch(changePushNotifications(path.slice(1), checked));
    } else if (path[0] === 'quickFilter') {
      dispatch(changeSetting(['notifications', ...path], checked));
      dispatch(setFilter('all'));
    } else {
      dispatch(changeSetting(['notifications', ...path], checked));
    }
  },

  onClear() {
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.clearMessage),
      confirm: intl.formatMessage(messages.clearConfirm),
      onConfirm: () => dispatch(clearNotifications()),
    }));
  },

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ColumnSettings));
