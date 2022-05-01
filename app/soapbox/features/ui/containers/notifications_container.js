import React from 'react';
import { injectIntl } from 'react-intl';
import { NotificationStack } from 'react-notification';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { dismissAlert } from '../../../actions/alerts';
import { getAlerts } from '../../../selectors';

const CustomNotificationStack = (props) => (
  <div role='assertive' data-testid='toast' className='z-1000 fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start'>
    <NotificationStack {...props} />
  </div>
);

const defaultBarStyleFactory = (index, style, notification) => {
  return Object.assign(
    {},
    style,
    { bottom: `${14 + index * 12 + index * 42}px` },
  );
};

const mapStateToProps = (state, { intl }) => {
  const notifications = getAlerts(state);

  notifications.forEach(notification => {
    ['title', 'message', 'actionLabel'].forEach(key => {
      const value = notification[key];

      if (typeof value === 'object') {
        notification[key] = intl.formatMessage(value);
      }
    });

    if (notification.actionLabel) {
      notification.action = (
        <Link to={notification.actionLink}>
          {notification.actionLabel}
        </Link>
      );
    }
  });

  return { notifications, linkComponent: Link };
};

const mapDispatchToProps = (dispatch) => {
  const onDismiss = alert => {
    dispatch(dismissAlert(alert));
  };

  return {
    onDismiss,
    onClick: onDismiss,
    barStyleFactory: defaultBarStyleFactory,
    activeBarStyleFactory: defaultBarStyleFactory,
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CustomNotificationStack));
