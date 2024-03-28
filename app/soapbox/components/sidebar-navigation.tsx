import { IconSwitchVertical } from '@tabler/icons';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Avatar, Divider } from 'soapbox/components/ui';
import Search from 'soapbox/features/compose/components/search';
import ComposeButton from 'soapbox/features/ui/components/compose-button';
import ProfileDropdown from 'soapbox/features/ui/components/profile-dropdown';
import { useAppSelector, useOwnAccount, useLogo } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';


import SidebarNavigationLink from './sidebar-navigation-link';

/** Desktop sidebar with links to different views in the app. */
const SidebarNavigation = () => {

  const logo = useLogo();
  const instance = useAppSelector((state) => state.instance);
  const account = useOwnAccount();
  const notificationCount = useAppSelector((state) => state.notifications.get('unread'));
  const chatsCount = useAppSelector((state) => state.chats.items.reduce((acc, curr) => acc + Math.min(curr.unread || 0, 1), 0));
  const followRequestsCount = useAppSelector((state) => state.user_lists.follow_requests.items.count());
  const dashboardCount = useAppSelector((state) => state.admin.openReports.count() + state.admin.awaitingApproval.count());

  const features = getFeatures(instance);

  return (
    <div className='flex flex-col gap-2 h-full overflow-hidden'>
      <div className='flex flex-col gap-5 mb-5'>
        {
          account && (
            <div className='flex gap-3 items-center'>
              <Link to={`/@${account.acct}`}>
                <Avatar src={account.avatar} size={36} />
              </Link>
              <div>
                <ProfileDropdown account={account}>
                  <div className='block capitalize text-lg font-bold leading-none'>
                    { account.username }&nbsp;<IconSwitchVertical className='inline w-[14px] h-[14px] text-gray-700 dark:text-gray-400' />
                  </div>
                </ProfileDropdown>
                <Link
                  className='block text-xs underline' to='/settings/profile'
                >
                  <FormattedMessage id='settings.edit_profile' defaultMessage='Edit profile' />
                </Link>
              </div>
            </div>
          )
        }
        <Search openInRoute autosuggest />
      </div>
      <div className='flex flex-col gap-2 shrink min-h-0 overflow-y-auto'>

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
          features.federating && features.bubbleTimeline && (
            <SidebarNavigationLink
              icon={require('@tabler/icons/hexagon.svg')}
              text={<FormattedMessage id='tabs_bar.bubble' defaultMessage='Featured' />}
              to='/timeline/bubble'
            />
          )
        }

        {
          features.federating && (
            <SidebarNavigationLink
              icon={require('icons/fediverse.svg')}
              text={<FormattedMessage id='tabs_bar.fediverse' defaultMessage='Explore' />}
              to='/timeline/fediverse'
            />
          )
        }

        <Divider />

        {account && (
          <>
            <SidebarNavigationLink
              to='/notifications'
              icon={require('@tabler/icons/bell.svg')}
              count={notificationCount}
              text={<FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />}
            />

            {
              features.chats && (
                <SidebarNavigationLink
                  to='/chats'
                  icon={require('@tabler/icons/messages.svg')}
                  count={chatsCount}
                  text={<FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' />}
                />
              )
            }

            {
              (features.directTimeline || features.conversations) && (
                <SidebarNavigationLink
                  to='/messages'
                  icon={require('@tabler/icons/mail.svg')}
                  text={<FormattedMessage id='column.direct' defaultMessage='Direct messages' />}
                />
              )
            }

            {
              features.bookmarks && (
                <SidebarNavigationLink
                  to='/bookmarks'
                  icon={require('@tabler/icons/bookmark.svg')}
                  text={<FormattedMessage id='column.bookmarks' defaultMessage='Bookmarks' />}
                />
              )
            }

            {
              features.lists && (
                <SidebarNavigationLink
                  to='/lists'
                  icon={require('@tabler/icons/list.svg')}
                  text={<FormattedMessage id='column.lists' defaultMessage='Lists' />}
                />
              )
            }

            {
              features.followTags && (
                <SidebarNavigationLink
                  to='/followed_hashtags'
                  icon={require('@tabler/icons/hash.svg')}
                  text={<FormattedMessage id='navigation_bar.tags' defaultMessage='Hashtags' />}
                />
              )
            }

            <Divider />

            {
              account.locked && (
                <SidebarNavigationLink
                  to='/follow_requests'
                  icon={require('@tabler/icons/user-plus.svg')}
                  text={<FormattedMessage id='navigation_bar.follow_requests' defaultMessage='Follow requests' />}
                  count={followRequestsCount}
                />
              )
            }
          </>
        )}

        {
          features.profileDirectory && (
            <SidebarNavigationLink
              to='/directory'
              icon={require('@tabler/icons/folder.svg')}
              text={<FormattedMessage id='navigation_bar.profile_directory' defaultMessage='Profile directory' />}
            />
          )
        }

        {
          account?.staff && (
            <SidebarNavigationLink
              to='/soapbox/admin'
              icon={require('@tabler/icons/dashboard.svg')}
              text={<FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' />}
              count={dashboardCount}
            />
          )
        }

        {
          account && (
            <SidebarNavigationLink
              to='/settings'
              icon={require('@tabler/icons/settings.svg')}
              text={<FormattedMessage id='tabs_bar.settings' defaultMessage='Settings' />}
              count={dashboardCount}
            />
          )
        }

      </div>
      {account && (
        <div className='pb-4'>
          <ComposeButton />
        </div>
      )}
    </div>

  );
};

export default SidebarNavigation;
