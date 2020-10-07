import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { NotificationStack } from 'react-notification';
import { dismissAlert } from '../../../actions/alerts';
import { getAlerts } from '../../../selectors';

const defaultBarStyleFactory = (index, style, notification) => {
  return Object.assign(
    {},
    style,
    { bottom: `${14 + index * 12 + index * 42}px` },
  );
};

const mapStateToProps = (state, { intl }) => {
  const notifications = getAlerts(state);

  notifications.forEach(notification => ['title', 'message'].forEach(key => {
    const value = notification[key];

    if (typeof value === 'object') {
      notification[key] = intl.formatMessage(value);
    }
  }));

  return { notifications };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDismiss: alert => {
      dispatch(dismissAlert(alert));
    },
    barStyleFactory: defaultBarStyleFactory,
    activeBarStyleFactory: defaultBarStyleFactory,
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(NotificationStack));
