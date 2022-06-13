import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import {
  followAccount,
  subscribeAccount,
  unsubscribeAccount,
} from 'soapbox/actions/accounts';
import snackbar from 'soapbox/actions/snackbar';
import { IconButton } from 'soapbox/components/ui';
import { useAppDispatch, useFeatures } from 'soapbox/hooks';

import type { Account as AccountEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  subscribe: { id: 'account.subscribe', defaultMessage: 'Subscribe to notifications from @{name}' },
  unsubscribe: { id: 'account.unsubscribe', defaultMessage: 'Unsubscribe to notifications from @{name}' },
  subscribeSuccess: { id: 'account.subscribe.success', defaultMessage: 'You have subscribed to this account.' },
  unsubscribeSuccess: { id: 'account.unsubscribe.success', defaultMessage: 'You have unsubscribed from this account.' },
  subscribeFailure: { id: 'account.subscribe.failure', defaultMessage: 'An error occurred trying to subscribed to this account.' },
  unsubscribeFailure: { id: 'account.unsubscribe.failure', defaultMessage: 'An error occurred trying to unsubscribed to this account.' },
});

interface ISubscriptionButton {
  account: AccountEntity
}

const SubscriptionButton = ({ account }: ISubscriptionButton) => {
  const dispatch = useAppDispatch();
  const features = useFeatures();
  const intl = useIntl();

  const following = account.relationship?.following;
  const requested = account.relationship?.requested;
  const isSubscribed = features.accountNotifies ?
    account.relationship?.notifying :
    account.relationship?.subscribing;
  const title = isSubscribed ?
    intl.formatMessage(messages.unsubscribe, { name: account.get('username') }) :
    intl.formatMessage(messages.subscribe, { name: account.get('username') });

  const onSubscribeSuccess = () =>
    dispatch(snackbar.success(intl.formatMessage(messages.subscribeSuccess)));

  const onSubscribeFailure = () =>
    dispatch(snackbar.error(intl.formatMessage(messages.subscribeFailure)));

  const onUnsubscribeSuccess = () =>
    dispatch(snackbar.success(intl.formatMessage(messages.unsubscribeSuccess)));

  const onUnsubscribeFailure = () =>
    dispatch(snackbar.error(intl.formatMessage(messages.unsubscribeFailure)));

  const onNotifyToggle = () => {
    if (account.relationship?.notifying) {
      dispatch(followAccount(account.get('id'), { notify: false } as any))
        ?.then(() => onUnsubscribeSuccess())
        .catch(() => onUnsubscribeFailure());
    } else {
      dispatch(followAccount(account.get('id'), { notify: true } as any))
        ?.then(() => onSubscribeSuccess())
        .catch(() => onSubscribeFailure());
    }
  };

  const onSubscriptionToggle = () => {
    if (account.relationship?.subscribing) {
      dispatch(unsubscribeAccount(account.get('id')))
        ?.then(() => onUnsubscribeSuccess())
        .catch(() => onUnsubscribeFailure());
    } else {
      dispatch(subscribeAccount(account.get('id')))
        ?.then(() => onSubscribeSuccess())
        .catch(() => onSubscribeFailure());
    }
  };

  const handleToggle = () => {
    if (features.accountNotifies) {
      onNotifyToggle();
    } else {
      onSubscriptionToggle();
    }
  };

  if (!features.accountSubscriptions) {
    return null;
  }

  if (requested || following) {
    return (
      <IconButton
        src={isSubscribed ? require('@tabler/icons/icons/bell-ringing.svg') : require('@tabler/icons/icons/bell.svg')}
        onClick={handleToggle}
        title={title}
        className='text-primary-700 bg-primary-100 dark:!bg-slate-700 dark:!text-white hover:bg-primary-200 p-2'
        iconClassName='w-5 h-5'
      />
    );
  }

  return null;
};

export default SubscriptionButton;
