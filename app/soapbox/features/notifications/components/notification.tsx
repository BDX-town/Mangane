import React, { useCallback } from 'react';
import { HotKeys } from 'react-hotkeys';
import { defineMessages, useIntl, FormattedMessage, IntlShape, MessageDescriptor } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Map as ImmutableMap } from 'immutable';

import { mentionCompose } from 'soapbox/actions/compose';
import { reblog, favourite, unreblog, unfavourite } from 'soapbox/actions/interactions';
import { openModal } from 'soapbox/actions/modals';
import { getSettings } from 'soapbox/actions/settings';
import { hideStatus, revealStatus } from 'soapbox/actions/statuses';
import Icon from 'soapbox/components/icon';
import Permalink from 'soapbox/components/permalink';
import { HStack, Text, EmojiReact } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import StatusContainer from 'soapbox/containers/status_container';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetNotification } from 'soapbox/selectors';
import { NotificationType, validType } from 'soapbox/utils/notification';

import type { ScrollPosition } from 'soapbox/components/status';
import type { Account, Status as StatusEntity, Notification as NotificationEntity } from 'soapbox/types/entities';

const getNotification = makeGetNotification();

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
  follow: require('@tabler/icons/user-plus.svg'),
  follow_request: require('@tabler/icons/user-plus.svg'),
  mention: require('@tabler/icons/at.svg'),
  favourite: require('@tabler/icons/heart.svg'),
  reblog: require('@tabler/icons/repeat.svg'),
  status: require('@tabler/icons/bell-ringing.svg'),
  poll: require('@tabler/icons/chart-bar.svg'),
  move: require('@tabler/icons/briefcase.svg'),
  'pleroma:chat_mention': require('@tabler/icons/messages.svg'),
  'pleroma:emoji_reaction': require('@tabler/icons/mood-happy.svg'),
  user_approved: require('@tabler/icons/user-plus.svg'),
  update: require('@tabler/icons/pencil.svg'),
};

const messages: Record<NotificationType, MessageDescriptor> = defineMessages({
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
  update: {
    id: 'notification.update',
    defaultMessage: '{name} edited a post you interacted with',
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
  onReblog?: (status: StatusEntity, e?: KeyboardEvent) => void,
  getScrollPosition?: () => ScrollPosition | undefined,
  updateScrollBottom?: (bottom: number) => void,
}

const Notification: React.FC<INotificaton> = (props) => {
  const { hidden = false, onMoveUp, onMoveDown } = props;

  const dispatch = useAppDispatch();

  const notification = useAppSelector((state) => getNotification(state, props.notification));

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

  const handleMention = useCallback((e?: KeyboardEvent) => {
    e?.preventDefault();

    if (account && typeof account === 'object') {
      dispatch(mentionCompose(account));
    }
  }, [account]);

  const handleHotkeyFavourite = useCallback((e?: KeyboardEvent) => {
    if (status && typeof status === 'object') {
      if (status.favourited) {
        dispatch(unfavourite(status));
      } else {
        dispatch(favourite(status));
      }
    }
  }, [status]);

  const handleHotkeyBoost = useCallback((e?: KeyboardEvent) => {
    if (status && typeof status === 'object') {
      dispatch((_, getState) => {
        const boostModal = getSettings(getState()).get('boostModal');
        if (status.reblogged) {
          dispatch(unreblog(status));
        } else {
          if (e?.shiftKey || !boostModal) {
            dispatch(reblog(status));
          } else {
            dispatch(openModal('BOOST', { status, onReblog: (status: StatusEntity) => {
              dispatch(reblog(status));
            } }));
          }
        }
      });
    }
  }, [status]);

  const handleHotkeyToggleHidden = useCallback((e?: KeyboardEvent) => {
    if (status && typeof status === 'object') {
      if (status.hidden) {
        dispatch(revealStatus(status.id));
      } else {
        dispatch(hideStatus(status.id));
      }
    }
  }, [status]);

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
        <EmojiReact
          emoji={ImmutableMap({ name: notification.emoji, url: notification.emoji_url })}
          className='w-4 h-4 flex-none'
        />
      );
    } else if (validType(type)) {
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
      case 'user_approved':
        return account && typeof account === 'object' ? (
          <AccountContainer
            id={account.id}
            hidden={hidden}
            avatarSize={48}
          />
        ) : null;
      case 'follow_request':
        return account && typeof account === 'object' ? (
          <AccountContainer
            id={account.id}
            hidden={hidden}
            avatarSize={48}
            actionType='follow_request'
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
      case 'update':
      case 'pleroma:emoji_reaction':
        return status && typeof status === 'object' ? (
          <StatusContainer
            id={status.id}
            withDismiss
            hidden={hidden}
            onMoveDown={handleMoveDown}
            onMoveUp={handleMoveUp}
          />
        ) : null;
      default:
        return null;
    }
  };

  const targetName = notification.target && typeof notification.target === 'object' ? notification.target.acct : '';

  const message: React.ReactNode = validType(type) && account && typeof account === 'object' ? buildMessage(intl, type, account, notification.total_count, targetName, instance.title) : null;

  const ariaLabel = validType(type) ? (
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
