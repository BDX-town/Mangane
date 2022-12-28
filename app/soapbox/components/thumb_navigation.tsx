import React from 'react';
import { FormattedMessage } from 'react-intl';

import ThumbNavigationLink from 'soapbox/components/thumb_navigation-link';
import { useAppSelector, useLogo, useOwnAccount, useSettings } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';

const ThumbNavigation: React.FC = (): JSX.Element => {
  const settings = useSettings();
  const account = useOwnAccount();
  const notificationCount = useAppSelector((state) => state.notifications.unread);
  const chatsCount = useAppSelector((state) => state.chats.items.reduce((acc, curr) => acc + Math.min(curr.unread || 0, 1), 0));
  const features = getFeatures(useAppSelector((state) => state.instance));
  const instance = useAppSelector((state) => state.instance);
  const logo = useLogo();

  const bubbleTimeline = features.bubbleTimeline && settings.getIn(['public', 'bubble']);

  /** Conditionally render the supported messages link */
  const renderMessagesLink = (): React.ReactNode => {
    if (features.chats) {
      return (
        <ThumbNavigationLink
          src={require('@tabler/icons/messages.svg')}
          text={<FormattedMessage id='navigation.chats' defaultMessage='Chats' />}
          to='/chats'
          exact
          count={chatsCount}
        />
      );
    }

    if (features.directTimeline || features.conversations) {
      return (
        <ThumbNavigationLink
          src={require('@tabler/icons/mail.svg')}
          text={<FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />}
          to='/messages'
          paths={['/messages', '/conversations']}
        />
      );
    }

    return null;
  };

  return (
    <div className='thumb-navigation'>
      <ThumbNavigationLink
        src={require('@tabler/icons/home.svg')}
        text={<FormattedMessage id='navigation.home' defaultMessage='Home' />}
        to='/'
        exact
      />

      {
        features.federating ? (
          <ThumbNavigationLink
            src={logo}
            text={instance.get('title')}
            to='/timeline/local'
            exact
          />
        ) : (
          <ThumbNavigationLink
            src={require('@tabler/icons/world.svg')}
            text={<FormattedMessage id='tabs_bar.all' defaultMessage='All' />}
            to='/timeline/local'
            exact
          />
        )
      }

      {
        features.federating && (
          <ThumbNavigationLink
            src={!bubbleTimeline ? require('icons/fediverse.svg') : require('@tabler/icons/hexagon.svg')}
            text={<FormattedMessage id='tabs_bar.fediverse' defaultMessage='Explore' />}
            to='/timeline/fediverse'
            exact
          />
        )
      }

      {account && renderMessagesLink()}

      {account && (
        <ThumbNavigationLink
          src={require('@tabler/icons/bell.svg')}
          text={<FormattedMessage id='navigation.notifications' defaultMessage='Alerts' />}
          to='/notifications'
          exact
          count={notificationCount}
        />
      )}

    </div>
  );
};

export default ThumbNavigation;
