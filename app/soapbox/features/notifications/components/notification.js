import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {  FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Icon from '../../../components/icon';
import Permalink from '../../../components/permalink';
import { HStack, Text } from '../../../components/ui';
import AccountContainer from '../../../containers/account_container';
import StatusContainer from '../../../containers/status_container';

const notificationForScreenReader = (intl, message, timestamp) => {
  const output = [message];

  output.push(intl.formatDate(timestamp, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }));

  return output.join(', ');
};

// Workaround for dynamic messages (https://github.com/formatjs/babel-plugin-react-intl/issues/119#issuecomment-326202499)
function FormattedMessageFixed(props) {
  return <FormattedMessage {...props} />;
}

const buildLink = (account) => (
  <bdi>
    <Permalink
      className='text-gray-800 dark:text-gray-200 font-bold hover:underline'
      href={`/@${account.get('acct')}`}
      title={account.get('acct')}
      to={`/@${account.get('acct')}`}
      dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
    />
  </bdi>
);

export const NOTIFICATION_TYPES = ['follow', 'mention', 'favourite', 'reblog'];

const icons = {
  follow: require('@tabler/icons/icons/user-plus.svg'),
  mention: require('@tabler/icons/icons/at.svg'),
  favourite: require('@tabler/icons/icons/heart.svg'),
  reblog: require('@tabler/icons/icons/repeat.svg'),
};

const messages = {
  follow: {
    id: 'notification.follow',
    defaultMessage: '{name} followed you',
  },
  mention: {
    id: 'notification.mentioned',
    defaultMessage: '{name} mentioned you',
  },
  favourite: {
    id: 'notification.favourite',
    defaultMessage: '{name} liked your TRUTH',
  },
  reblog: {
    id: 'notification.reblog',
    defaultMessage: '{name} re-TRUTH your TRUTH',
  },
};

const buildMessage = (type, account) => {
  const link = buildLink(account);

  return (
    <FormattedMessageFixed
      id={messages[type].id}
      defaultMessage={messages[type].defaultMessage}
      values={{ name: link }}
    />
  );
};

const Notification = (props) => {
  const { hidden, notification, onMoveUp, onMoveDown } = props;

  const history = useHistory();
  const intl = useIntl();

  const type = notification.get('type');
  const timestamp = notification.get('created_at');
  const account = notification.get('account');

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
    if (notification.get('status')) {
      history.push(`/@${notification.getIn(['account', 'acct'])}/posts/${notification.getIn(['status', 'id'])}`);
    } else {
      handleOpenProfile();
    }
  };

  const handleOpenProfile = () => {
    history.push(`/@${notification.getIn(['account', 'acct'])}`);
  };

  const handleMention = (event) => {
    event.preventDefault();

    props.onMention(notification.get('account'), history);
  };

  const handleHotkeyFavourite = () => {
    const status = notification.get('status');
    if (status) props.onFavourite(status);
  };

  const handleHotkeyBoost = (e) => {
    const status = notification.get('status');
    if (status) props.onReblog(status, e);
  };

  const handleHotkeyToggleHidden = () => {
    const status = notification.get('status');
    if (status) props.onToggleHidden(status);
  };

  const handleMoveUp = () => {
    onMoveUp(notification.get('id'));
  };

  const handleMoveDown = () => {
    onMoveDown(notification.get('id'));
  };

  const renderContent = () => {
    switch (type) {
    case 'follow':
      return (
        <AccountContainer
          id={notification.getIn(['account', 'id'])}
          withNote={false}
          hidden={hidden}
          avatarSize={48}
        />
      );
    case 'favourite':
    case 'mention':
    case 'reblog':
      return (
        <StatusContainer
          id={notification.getIn(['status', 'id'])}
          withDismiss
          hidden={hidden}
          onMoveDown={handleMoveDown}
          onMoveUp={handleMoveUp}
          contextType='notifications'
          getScrollPosition={props.getScrollPosition}
          updateScrollBottom={props.updateScrollBottom}
          cachedMediaWidth={props.cachedMediaWidth}
          cacheMediaWidth={props.cacheMediaWidth}
        />
      );
    default:
      return null;
    }
  };

  if (!NOTIFICATION_TYPES.includes(type)) {
    return null;
  }

  const message = buildMessage(type, account);

  return (
    <HotKeys handlers={getHandlers()}>
      <div
        className='notification focusable'
        tabIndex='0'
        aria-label={
          notificationForScreenReader(
            intl,
            intl.formatMessage({
              id: messages[type].id,
              defaultMessage: messages[type].defaultMessage,
            },
            {
              name: notification.getIn(['account', 'acct']),
            }),
            notification.get('created_at'),
          )
        }
      >
        <div className='p-4 focusable'>
          <div className='mb-2'>
            <HStack alignItems='center' space={1.5}>
              <Icon
                src={icons[type]}
                className='text-primary-600'
              />

              <div>
                <Text
                  theme='muted'
                  size='sm'
                  title={timestamp}
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

Notification.propTypes = {
  hidden: PropTypes.bool,
  notification: ImmutablePropTypes.record.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onMention: PropTypes.func.isRequired,
  onFavourite: PropTypes.func.isRequired,
  onReblog: PropTypes.func.isRequired,
  onToggleHidden: PropTypes.func.isRequired,
  getScrollPosition: PropTypes.func,
  updateScrollBottom: PropTypes.func,
  cacheMediaWidth: PropTypes.func,
  cachedMediaWidth: PropTypes.number,
  siteTitle: PropTypes.string,
};

export default Notification;
