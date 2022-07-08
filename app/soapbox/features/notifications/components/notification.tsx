import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { defineMessages, useIntl, FormattedMessage, IntlShape, MessageDescriptor } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Icon from 'soapbox/components/icon';
import Permalink from 'soapbox/components/permalink';
import { HStack, Text, Emoji } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import StatusContainer from 'soapbox/containers/status_container';
import { useAppSelector } from 'soapbox/hooks';

import type { ScrollPosition } from 'soapbox/components/status';
import type { NotificationType } from 'soapbox/normalizers/notification';
import type { Account, Status, Notification as NotificationEntity } from 'soapbox/types/entities';

const notificationForScreenReader = (intl: IntlShape, message: string, timestamp: Date) => {
  const output = [message];

  output.push(intl.formatDate(timestamp, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }));

  return output.join(', ');
};

const buildLink = (account: Account): JSX.Element => (
  <bdi>
    <Permalink
      className='text-gray-800 dark:text-gray-200 font-bold hover:underline'
      href={`/@${account.acct}`}
      title={account.acct}
      to={`/@${account.acct}`}
      dangerouslySetInnerHTML={{ __html: account.display_name_html }}
    />
  </bdi>
);

const icons: Record<NotificationType, string> = {
  follow: require('@tabler/icons/icons/user-plus.svg'),
  follow_request: require('@tabler/icons/icons/user-plus.svg'),
  mention: require('@tabler/icons/icons/at.svg'),
  favourite: require('@tabler/icons/icons/heart.svg'),
  reblog: require('@tabler/icons/icons/repeat.svg'),
  status: require('@tabler/icons/icons/bell-ringing.svg'),
  poll: require('@tabler/icons/icons/chart-bar.svg'),
  move: require('@tabler/icons/icons/briefcase.svg'),
  'pleroma:chat_mention': require('@tabler/icons/icons/messages.svg'),
  'pleroma:emoji_reaction': require('@tabler/icons/icons/mood-happy.svg'),
  user_approved: require('@tabler/icons/icons/user-plus.svg'),
};

const messages: Record<string | number | symbol, MessageDescriptor> = defineMessages({
  follow: {
    id: 'notification.follow',
    defaultMessage: '{name} followed you',
  },
  follow_request: {
    id: 'notification.follow_request',
    defaultMessage: '{name} has requested to follow you',
  },
  mention: {
    id: 'notification.mentioned',
    defaultMessage: '{name} mentioned you',
  },
  favourite: {
    id: 'notification.favourite',
    defaultMessage: '{name} liked your post',
  },
  reblog: {
    id: 'notification.reblog',
    defaultMessage: '{name} reposted your post',
  },
  status: {
    id: 'notification.status',
    defaultMessage: '{name} just posted',
  },
  poll: {
    id: 'notification.poll',
    defaultMessage: 'A poll you have voted in has ended',
  },
  move: {
    id: 'notification.move',
    defaultMessage: '{name} moved to {targetName}',
  },
  'pleroma:chat_mention': {
    id: 'notification.pleroma:chat_mention',
    defaultMessage: '{name} sent you a message',
  },
  'pleroma:emoji_reaction': {
    id: 'notification.pleroma:emoji_reaction',
    defaultMessage: '{name} reacted to your post',
  },
  user_approved: {
    id: 'notification.user_approved',
    defaultMessage: 'Welcome to {instance}!',
  },
});

const buildMessage = (
  intl: IntlShape,
  type: NotificationType,
  account: Account,
  totalCount: number | null,
  targetName: string,
  instanceTitle: string,
): React.ReactNode => {
  const link = buildLink(account);
  const name = intl.formatMessage({
    id: 'notification.name',
    defaultMessage: '{link}{others}',
  }, {
    link,
    others: totalCount && totalCount > 0 ? (
      <FormattedMessage
        id='notification.others'
        defaultMessage=' + {count} {count, plural, one {other} other {others}}'
        values={{ count: totalCount - 1 }}
      />
    ) : '',
  });

  return intl.formatMessage(messages[type], {
    name,
    targetName,
    instance: instanceTitle,
  });
};

interface INotificaton {
  hidden?: boolean,
  notification: NotificationEntity,
  onMoveUp?: (notificationId: string) => void,
  onMoveDown?: (notificationId: string) => void,
  onMention?: (account: Account) => void,
  onFavourite?: (status: Status) => void,
  onReblog?: (status: Status, e?: KeyboardEvent) => void,
  onToggleHidden?: (status: Status) => void,
  getScrollPosition?: () => ScrollPosition | undefined,
  updateScrollBottom?: (bottom: number) => void,
  siteTitle?: string,
}

const Notification: React.FC<INotificaton> = (props) => {
  const { hidden = false, notification, onMoveUp, onMoveDown } = props;

  const history = useHistory();
  const intl = useIntl();
  const instance = useAppSelector((state) => state.instance);

  const type = notification.type;
  const { account, status } = notification;

  const getHandlers = () => ({
    reply: handleMention,
    favourite: handleHotkeyFavourite,
    boost: handleHotkeyBoost,
    mention: handleMention,
    open: handleOpen,
    openProfile: handleOpenProfile,
    moveUp: handleMoveUp,
    moveDown: handleMoveDown,
    toggleHidden: handleHotkeyToggleHidden,
  });

  const handleOpen = () => {
    if (status && typeof status === 'object' && account && typeof account === 'object') {
      history.push(`/@${account.acct}/posts/${status.id}`);
    } else {
      handleOpenProfile();
    }
  };

  const handleOpenProfile = () => {
    if (account && typeof account === 'object') {
      history.push(`/@${account.acct}`);
    }
  };

  const handleMention = (e?: KeyboardEvent) => {
    e?.preventDefault();

    if (props.onMention && account && typeof account === 'object') {
      props.onMention(account);
    }
  };

  const handleHotkeyFavourite = (e?: KeyboardEvent) => {
    if (props.onFavourite && status && typeof status === 'object') {
      props.onFavourite(status);
    }
  };

  const handleHotkeyBoost = (e?: KeyboardEvent) => {
    if (props.onReblog && status && typeof status === 'object') {
      props.onReblog(status, e);
    }
  };

  const handleHotkeyToggleHidden = (e?: KeyboardEvent) => {
    if (props.onToggleHidden && status && typeof status === 'object') {
      props.onToggleHidden(status);
    }
  };

  const handleMoveUp = () => {
    if (onMoveUp) {
      onMoveUp(notification.id);
    }
  };

  const handleMoveDown = () => {
    if (onMoveDown) {
      onMoveDown(notification.id);
    }
  };

  const renderIcon = (): React.ReactNode => {
    if (type === 'pleroma:emoji_reaction' && notification.emoji) {
      return (
        <Emoji
          emoji={notification.emoji}
          className='w-4 h-4 flex-none'
        />
      );
    } else if (type) {
      return (
        <Icon
          src={icons[type]}
          className='text-primary-600 dark:text-primary-400 flex-none'
        />
      );
    } else {
      return null;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'follow':
      case 'follow_request':
      case 'user_approved':
        return account && typeof account === 'object' ? (
          <AccountContainer
            id={account.id}
            hidden={hidden}
            avatarSize={48}
          />
        ) : null;
      case 'move':
        return account && typeof account === 'object' && notification.target && typeof notification.target === 'object' ? (
          <AccountContainer
            id={notification.target.id}
            hidden={hidden}
            avatarSize={48}
          />
        ) : null;
      case 'favourite':
      case 'mention':
      case 'reblog':
      case 'status':
      case 'poll':
      case 'pleroma:emoji_reaction':
        return status && typeof status === 'object' ? (
          // @ts-ignore
          <StatusContainer
            id={status.id}
            withDismiss
            hidden={hidden}
            onMoveDown={handleMoveDown}
            onMoveUp={handleMoveUp}
            contextType='notifications'
            getScrollPosition={props.getScrollPosition}
            updateScrollBottom={props.updateScrollBottom}
          />
        ) : null;
      default:
        return null;
    }
  };

  const targetName = notification.target && typeof notification.target === 'object' ? notification.target.acct : '';

  const message: React.ReactNode = type && account && typeof account === 'object' ? buildMessage(intl, type, account, notification.total_count, targetName, instance.title) : null;

  const ariaLabel = messages[type] ? (
    notificationForScreenReader(
      intl,
      intl.formatMessage(messages[type], {
        name: account && typeof account === 'object' ? account.acct : '',
        targetName,
      }),
      notification.created_at,
    )
  ) : '';

  return (
    <HotKeys handlers={getHandlers()} data-testid='notification'>
      <div
        className='notification focusable'
        tabIndex={0}
        aria-label={ariaLabel}
      >
        <div className='p-4 focusable'>
          <div className='mb-2'>
            <HStack alignItems='center' space={1.5}>
              {renderIcon()}

              <div className='truncate'>
                <Text
                  theme='muted'
                  size='sm'
                  truncate
                  data-testid='message'
                >
                  {message}
                </Text>
              </div>
            </HStack>
          </div>

          <div>
            {renderContent()}
          </div>
        </div>
      </div>
    </HotKeys>
  );
};

export default Notification;
