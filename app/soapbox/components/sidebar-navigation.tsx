import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { getSettings } from 'soapbox/actions/settings';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import ComposeButton from 'soapbox/features/ui/components/compose-button';
import { useAppSelector, useOwnAccount, useLogo } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';

import SidebarNavigationLink from './sidebar-navigation-link';

import type { Menu } from 'soapbox/components/dropdown_menu';

const messages = defineMessages({
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  bookmarks: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  developers: { id: 'navigation.developers', defaultMessage: 'Developers' },
  dashboard: { id: 'tabs_bar.dashboard', defaultMessage: 'Dashboard' },
  all: { id: 'tabs_bar.all', defaultMessage: 'All' },
  fediverse: { id: 'tabs_bar.fediverse', defaultMessage: 'Explore' },
  settings: { id: 'tabs_bar.settings', defaultMessage: 'Settings' },
  direct: { id: 'column.direct', defaultMessage: 'Direct messages' },
  directory: { id: 'navigation_bar.profile_directory', defaultMessage: 'Profile directory' },
  tags: { id: 'navigation_bar.tags', defaultMessage: 'Hashtags' },
});

/** Desktop sidebar with links to different views in the app. */
const SidebarNavigation = () => {
  const intl = useIntl();

  const logo = useLogo();
  const instance = useAppSelector((state) => state.instance);
  const settings = useAppSelector((state) => getSettings(state));
  const account = useOwnAccount();
  const notificationCount = useAppSelector((state) => state.notifications.get('unread'));
  const chatsCount = useAppSelector((state) => state.chats.items.reduce((acc, curr) => acc + Math.min(curr.unread || 0, 1), 0));
  const followRequestsCount = useAppSelector((state) => state.user_lists.follow_requests.items.count());
  const dashboardCount = useAppSelector((state) => state.admin.openReports.count() + state.admin.awaitingApproval.count());

  const features = getFeatures(instance);
  const bubbleTimeline = features.bubbleTimeline && settings.getIn(['public', 'bubble']);

  const makeMenu = (): Menu => {
    const menu: Menu = [];

    if (account) {
      if (account.locked || followRequestsCount > 0) {
        menu.push({
          to: '/follow_requests',
          text: intl.formatMessage(messages.follow_requests),
          icon: require('@tabler/icons/user-plus.svg'),
          count: followRequestsCount,
        });
      }

      // we only want to add this option is it's not already shown
      // so only when chats are supported
      if (features.chats) {
        menu.push({
          to: '/messages',
          text: intl.formatMessage(messages.direct),
          icon: require('@tabler/icons/mail.svg'),
        });
      }

      if (features.bookmarks) {
        menu.push({
          to: '/bookmarks',
          text: intl.formatMessage(messages.bookmarks),
          icon: require('@tabler/icons/bookmark.svg'),
        });
      }

      if (features.lists) {
        menu.push({
          to: '/lists',
          text: intl.formatMessage(messages.lists),
          icon: require('@tabler/icons/list.svg'),
        });
      }

      if (features.followTags) {
        menu.push({
          to: '/followed_hashtags',
          text: intl.formatMessage(messages.tags),
          icon: require('@tabler/icons/hash.svg'),
        });
      }

      if (features.profileDirectory) {
        menu.push({
          to: '/directory',
          text: intl.formatMessage(messages.directory),
          icon: require('@tabler/icons/folder.svg'),
        });
      }

      if (settings.get('isDeveloper')) {
        menu.push({
          to: '/developers',
          icon: require('@tabler/icons/code.svg'),
          text: intl.formatMessage(messages.developers),
        });
      }

      if (account.staff) {
        menu.push({
          to: '/soapbox/admin',
          icon: require('@tabler/icons/dashboard.svg'),
          text: intl.formatMessage(messages.dashboard),
          count: dashboardCount,
        });
      }

      menu.push({
        to: '/settings',
        icon: require('@tabler/icons/settings.svg'),
        text: intl.formatMessage(messages.settings),
      });

    }

    return menu;
  };

  const menu = makeMenu();

  /** Conditionally render the supported messages link */
  const renderMessagesLink = (): React.ReactNode => {
    if (features.chats) {
      return (
        <SidebarNavigationLink
          to='/chats'
          icon={require('@tabler/icons/messages.svg')}
          count={chatsCount}
          text={<FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' />}
        />
      );
    }

    if (features.directTimeline || features.conversations) {
      return (
        <SidebarNavigationLink
          to='/messages'
          icon={require('@tabler/icons/mail.svg')}
          text={<FormattedMessage id='column.direct' defaultMessage='Direct messages' />}
        />
      );
    }

    return null;
  };

  return (
    <div>
      <div className='flex flex-col space-y-2'>
        <SidebarNavigationLink
          to='/'
          icon={require('@tabler/icons/home.svg')}
          text={<FormattedMessage id='tabs_bar.home' defaultMessage='Home' />}
        />

        {
          features.federating ? (
            <SidebarNavigationLink
              icon={logo}
              text={<>{instance.get('title')}</>}
              to='/timeline/local'
            />
          ) : (
            <SidebarNavigationLink
              icon={require('@tabler/icons/world.svg')}
              text={<FormattedMessage id='tabs_bar.all' defaultMessage='All' />}
              to='/timeline/local'
            />
          )
        }

        {
          features.federating && (
            <SidebarNavigationLink
              icon={!bubbleTimeline ? require('icons/fediverse.svg') : require('@tabler/icons/hexagon.svg')}
              text={<FormattedMessage id='tabs_bar.fediverse' defaultMessage='Explore' />}
              to='/timeline/fediverse'
            />
          )
        }

        {account && (
          <>
            <SidebarNavigationLink
              to='/notifications'
              icon={require('@tabler/icons/bell.svg')}
              count={notificationCount}
              text={<FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />}
            />

            {renderMessagesLink()}
          </>
        )}

        {menu.length > 0 && (
          <DropdownMenu items={menu}>
            <SidebarNavigationLink
              icon={require('@tabler/icons/dots-circle-horizontal.svg')}
              count={dashboardCount}
              text={<FormattedMessage id='tabs_bar.more' defaultMessage='More' />}
            />
          </DropdownMenu>
        )}
      </div>

      {account && (
        <ComposeButton />
      )}
    </div>
  );
};

export default SidebarNavigation;
