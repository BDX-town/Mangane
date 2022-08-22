import React from 'react';
import { useIntl, MessageDescriptor } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { dismissAlert } from 'soapbox/actions/alerts';
import { Button } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { NotificationStack, NotificationObject, StyleFactoryFn } from 'soapbox/react-notification';

import type { Alert } from 'soapbox/reducers/alerts';

/** Portal for snackbar alerts. */
const SnackbarContainer: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const alerts = useAppSelector(state => state.alerts);

  /** Apply i18n to the message if it's an object. */
  const maybeFormatMessage = (message: MessageDescriptor | string): string => {
    switch (typeof message) {
      case 'string': return message;
      case 'object': return intl.formatMessage(message);
      default: return '';
    }
  };

  /** Convert a reducer Alert into a react-notification object. */
  const buildAlert = (item: Alert): NotificationObject => {
    // Backwards-compatibility
    if (item.actionLink) {
      item = item.set('action', () => history.push(item.actionLink));
    }

    const alert: NotificationObject = {
      message: maybeFormatMessage(item.message),
      title: maybeFormatMessage(item.title),
      key: item.key,
      className: `notification-bar-${item.severity}`,
      activeClassName: 'snackbar--active',
      dismissAfter: item.dismissAfter,
      style: false,
    };

    if (item.action && item.actionLabel) {
      // HACK: it's a JSX.Element instead of a string!
      // react-notification displays it just fine.
      alert.action = (
        <Button theme='ghost' size='sm' onClick={item.action} text={maybeFormatMessage(item.actionLabel)} />
      ) as any;
    }

    return alert;
  };

  const onDismiss = (alert: NotificationObject) => {
    dispatch(dismissAlert(alert));
  };

  const defaultBarStyleFactory: StyleFactoryFn = (index, style, _notification) => {
    return Object.assign(
      {},
      style,
      { bottom: `${14 + index * 12 + index * 42}px` },
    );
  };

  const notifications = alerts.toArray().map(buildAlert);

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
