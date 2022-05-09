import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getSettings } from 'soapbox/actions/settings';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import ComposeButton from 'soapbox/features/ui/components/compose-button';
import { useAppSelector, useOwnAccount } from 'soapbox/hooks';
import { getBaseURL } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

import SidebarNavigationLink from './sidebar-navigation-link';

import type { Menu } from 'soapbox/components/dropdown_menu';

const SidebarNavigation = () => {
  const instance = useAppSelector((state) => state.instance);
  const settings = useAppSelector((state) => getSettings(state));
  const account = useOwnAccount();
  const notificationCount = useAppSelector((state) => state.notifications.get('unread'));
  const chatsCount = useAppSelector((state) => state.chats.get('items').reduce((acc: any, curr: any) => acc + Math.min(curr.get('unread', 0), 1), 0));
  const followRequestsCount = useAppSelector((state) => state.user_lists.getIn(['follow_requests', 'items'], ImmutableOrderedSet()).count());
  const dashboardCount = useAppSelector((state) => state.admin.openReports.count() + state.admin.awaitingApproval.count());

  const baseURL = account ? getBaseURL(account) : '';
  const features = getFeatures(instance);

  const makeMenu = (): Menu => {
    const menu: Menu = [];

    if (account) {
      if (account.locked || followRequestsCount > 0) {
        menu.push({
          to: '/follow_requests',
          text: <FormattedMessage id='navigation_bar.follow_requests' defaultMessage='Follow requests' />,
          icon: require('@tabler/icons/icons/user-plus.svg'),
          // TODO: let menu items have a counter
          // count: followRequestsCount,
        });
      }

      if (features.bookmarks) {
        menu.push({
          to: '/bookmarks',
          text: <FormattedMessage id='column.bookmarks' defaultMessage='Bookmarks' />,
          icon: require('@tabler/icons/icons/bookmark.svg'),
        });
      }

      if (features.lists) {
        menu.push({
          to: '/lists',
          text: <FormattedMessage id='column.lists' defaultMessage='Lists' />,
          icon: require('@tabler/icons/icons/list.svg'),
        });
      }

      if (instance.invites_enabled) {
        menu.push({
          to: `${baseURL}/invites`,
          icon: require('@tabler/icons/icons/mailbox.svg'),
          text: <FormattedMessage id='navigation.invites' defaultMessage='Invites' />,
        });
      }

      if (settings.get('isDeveloper')) {
        menu.push({
          to: '/developers',
          icon: require('@tabler/icons/icons/code.svg'),
          text: <FormattedMessage id='navigation.developers' defaultMessage='Developers' />,
        });
      }

      if (account.staff) {
        menu.push({
          to: '/soapbox/admin',
          icon: require('@tabler/icons/icons/dashboard.svg'),
          text: <FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' />,
          count: dashboardCount,
        });
      }

      if (features.publicTimeline) {
        menu.push(null);
      }
    }

    if (features.publicTimeline) {
      menu.push({
        to: '/timeline/local',
        icon: features.federating ? require('@tabler/icons/icons/users.svg') : require('@tabler/icons/icons/world.svg'),
        text: features.federating ? instance.title : <FormattedMessage id='tabs_bar.all' defaultMessage='All' />,
      });
    }

    if (features.publicTimeline && features.federating) {
      menu.push({
        to: '/timeline/fediverse',
        icon: require('icons/fediverse.svg'),
        text: <FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />,
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
          icon={require('@tabler/icons/icons/messages.svg')}
          count={chatsCount}
          text={<FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' />}
        />
      );
    }

    if (features.directTimeline || features.conversations) {
      return (
        <SidebarNavigationLink
          to='/messages'
          icon={require('@tabler/icons/icons/mail.svg')}
          text={<FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />}
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
          icon={require('icons/feed.svg')}
          text={<FormattedMessage id='tabs_bar.home' defaultMessage='Home' />}
        />

        {account && (
          <>
            <SidebarNavigationLink
              to={`/@${account.acct}`}
              icon={require('icons/user.svg')}
              text={<FormattedMessage id='tabs_bar.profile' defaultMessage='Profile' />}
            />

            <SidebarNavigationLink
              to='/notifications'
              icon={require('icons/alert.svg')}
              count={notificationCount}
              text={<FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />}
            />

            <SidebarNavigationLink
              to='/settings'
              icon={require('@tabler/icons/icons/settings.svg')}
              text={<FormattedMessage id='tabs_bar.settings' defaultMessage='Settings' />}
            />
          </>
        )}

        {account && renderMessagesLink()}

        {menu.length > 0 && (
          <DropdownMenu items={menu}>
            <SidebarNavigationLink
              icon={require('@tabler/icons/icons/dots-circle-horizontal.svg')}
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
