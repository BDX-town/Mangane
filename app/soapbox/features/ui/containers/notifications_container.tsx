import React from 'react';
import { useIntl } from 'react-intl';
import { NotificationStack, NotificationObject, StyleFactoryFn } from 'react-notification';
import { Link } from 'react-router-dom';

import { Button } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

import { dismissAlert } from '../../../actions/alerts';
import { getAlerts } from '../../../selectors';

const defaultBarStyleFactory: StyleFactoryFn = (index, style, _notification) => {
  return Object.assign(
    {},
    style,
    { bottom: `${14 + index * 12 + index * 42}px` },
  );
};

const SnackbarContainer: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const notifications = useAppSelector(getAlerts);

  notifications.forEach(notification => {
    ['title', 'message', 'actionLabel'].forEach(key => {
      // @ts-ignore
      const value = notification[key];

      if (typeof value === 'object') {
        // @ts-ignore
        notification[key] = intl.formatMessage(value);
      }
    });

    if (notification.action) {
      const { action } = notification;
      notification.action = (
        <Button theme='ghost' size='sm' onClick={action} text={notification.actionLabel} />
      );
    } else if (notification.actionLabel) {
      notification.action = (
        <Link to={notification.actionLink}>
          {notification.actionLabel}
        </Link>
      );
    }
  });

  const onDismiss = (alert: NotificationObject) => {
    dispatch(dismissAlert(alert));
  };

  return (
    <div role='assertive' data-testid='toast' className='z-1000 fixed inset-0 flex items-end px-4 py-6 pointer-events-none pt-16 lg:pt-20 sm:items-start'>
      <NotificationStack
        onDismiss={onDismiss}
        onClick={onDismiss}
        barStyleFactory={defaultBarStyleFactory}
        activeBarStyleFactory={defaultBarStyleFactory}
        notifications={notifications}
      />
    </div>
  );
};

export default SnackbarContainer;
