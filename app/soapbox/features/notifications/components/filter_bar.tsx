import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { openModal } from 'soapbox/actions/modals';
import { setFilter, clearNotifications } from 'soapbox/actions/notifications';
import Icon from 'soapbox/components/icon';
import { Tabs } from 'soapbox/components/ui';
import { useAppDispatch, useFeatures, useSettings } from 'soapbox/hooks';

import type { Item } from 'soapbox/components/ui/tabs/tabs';
import ClearColumnButton from './clear_column_button';

const messages = defineMessages({
  all: { id: 'notifications.filter.all', defaultMessage: 'All' },
  mentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
  favourites: { id: 'notifications.filter.favourites', defaultMessage: 'Likes' },
  boosts: { id: 'notifications.filter.boosts', defaultMessage: 'Reposts' },
  polls: { id: 'notifications.filter.polls', defaultMessage: 'Poll results' },
  follows: { id: 'notifications.filter.follows', defaultMessage: 'Follows' },
  emoji_reacts: { id: 'notifications.filter.emoji_reacts', defaultMessage: 'Emoji reacts' },
  statuses: { id: 'notifications.filter.statuses', defaultMessage: 'Updates from people you follow' },

  clearHeading: { id: 'notifications.clear_heading', defaultMessage: 'Clear notifications' },
  clearMessage: { id: 'notifications.clear_confirmation', defaultMessage: 'Are you sure you want to permanently clear all your notifications?' },
  clearConfirm: { id: 'notifications.clear', defaultMessage: 'Clear notifications' },
});

const NotificationFilterBar = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const features = useFeatures();

  const selectedFilter = settings.getIn(['notifications', 'quickFilter', 'active']) as string;
  const advancedMode = settings.getIn(['notifications', 'quickFilter', 'advanced']);

  const onClick = (notificationType: string) => () => dispatch(setFilter(notificationType));

  const onClear = React.useCallback(() => {
    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/eraser.svg'),
      heading: intl.formatMessage(messages.clearHeading),
      message: intl.formatMessage(messages.clearMessage),
      confirm: intl.formatMessage(messages.clearConfirm),
      onConfirm: () => dispatch(clearNotifications()),
    }));
  }, [dispatch, openModal, clearNotifications]);
  

  const items: Item[] = [
    {
      text: intl.formatMessage(messages.all),
      action: onClick('all'),
      name: 'all',
    },
  ];

  if (!advancedMode) {
    items.push({
      text: intl.formatMessage(messages.mentions),
      action: onClick('mention'),
      name: 'mention',
    });
  } else {
    items.push({
      text: <Icon src={require('@tabler/icons/at.svg')} />,
      title: intl.formatMessage(messages.mentions),
      action: onClick('mention'),
      name: 'mention',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/heart.svg')} />,
      title: intl.formatMessage(messages.favourites),
      action: onClick('favourite'),
      name: 'favourite',
    });
    if (features.emojiReacts) items.push({
      text: <Icon src={require('@tabler/icons/mood-smile.svg')} />,
      title: intl.formatMessage(messages.emoji_reacts),
      action: onClick('pleroma:emoji_reaction'),
      name: 'pleroma:emoji_reaction',
    });
    items.push({
      text: <Icon src={require('feather-icons/dist/icons/repeat.svg')} />,
      title: intl.formatMessage(messages.boosts),
      action: onClick('reblog'),
      name: 'reblog',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/chart-bar.svg')} />,
      title: intl.formatMessage(messages.polls),
      action: onClick('poll'),
      name: 'poll',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/bell-ringing.svg')} />,
      title: intl.formatMessage(messages.statuses),
      action: onClick('status'),
      name: 'status',
    });
    items.push({
      text: <Icon src={require('@tabler/icons/user-plus.svg')} />,
      title: intl.formatMessage(messages.follows),
      action: onClick('follow'),
      name: 'follow',
    });
  }

  return (
    <>
      <div className='flex justify-between items-center mb-2'>
        <Icon className='h-6 w-6 text-gray-500 dark:text-gray-400' src={require('@tabler/icons/bell.svg')} />
        <ClearColumnButton onClick={onClear} />
      </div>
      <Tabs items={items} activeItem={selectedFilter} />
    </>
  );
};

export default NotificationFilterBar;
