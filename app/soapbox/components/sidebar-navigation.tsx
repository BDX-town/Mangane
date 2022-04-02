import { Map as ImmutableMap } from 'immutable';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getSettings } from 'soapbox/actions/settings';
import ComposeButton from 'soapbox/features/ui/components/compose-button';
import { useAppSelector } from 'soapbox/hooks';
import { getBaseURL } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';

import SidebarNavigationLink from './sidebar-navigation-link';

const SidebarNavigation = () => {
  const me = useAppSelector((state) => state.me);
  const instance = useAppSelector((state) => state.instance);
  const settings = useAppSelector((state) => getSettings(state));
  const account = useAppSelector((state) => state.accounts.get(me));
  const notificationCount = useAppSelector((state) => state.notifications.get('unread'));
  const chatsCount = useAppSelector((state) => state.chats.get('items').reduce((acc: any, curr: any) => acc + Math.min(curr.get('unread', 0), 1), 0));

  const baseURL = getBaseURL(ImmutableMap(account));
  const features = getFeatures(instance);

  return (
    <div>
      <div className='flex flex-col space-y-2'>
        <SidebarNavigationLink
          to='/'
          icon={require('icons/feed.svg')}
          text={<FormattedMessage id='tabs_bar.home' defaultMessage='Feed' />}
        />

        {account && (
          <>
            <SidebarNavigationLink
              to={`/@${account.get('acct')}`}
              icon={require('icons/user.svg')}
              text={<FormattedMessage id='tabs_bar.profile' defaultMessage='Profile' />}
            />

            <SidebarNavigationLink
              to='/notifications'
              icon={require('icons/alert.svg')}
              count={notificationCount}
              text={<FormattedMessage id='tabs_bar.notifications' defaultMessage='Alerts' />}
            />

            <SidebarNavigationLink
              to='/settings'
              icon={require('icons/cog.svg')}
              text={<FormattedMessage id='tabs_bar.settings' defaultMessage='Settings' />}
            />
          </>
        )}

        {account && (
          features.chats ? (
            <SidebarNavigationLink
              to='/chats'
              icon={require('@tabler/icons/icons/messages.svg')}
              count={chatsCount}
              text={<FormattedMessage id='tabs_bar.chats' defaultMessage='Chats' />}
            />
          ) : (
            <SidebarNavigationLink
              to='/messages'
              icon={require('icons/mail.svg')}
              text={<FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />}
            />
          )
        )}

        {/* {(account && account.staff) && (
          <SidebarNavigationLink
            to='/admin'
            icon={location.pathname.startsWith('/admin') ? require('icons/dashboard-filled.svg') : require('@tabler/icons/icons/dashboard.svg')}
            text={<FormattedMessage id='tabs_bar.dashboard' defaultMessage='Dashboard' />}
            count={dashboardCount}
          />
        )} */}

        {(account && instance.get('invites_enabled')) && (
          <SidebarNavigationLink
            to={`${baseURL}/invites`}
            icon={require('@tabler/icons/icons/mailbox.svg')}
            text={<FormattedMessage id='navigation.invites' defaultMessage='Invites' />}
          />
        )}

        {(settings.get('isDeveloper')) && (
          <SidebarNavigationLink
            to='/developers'
            icon={require('@tabler/icons/icons/code.svg')}
            text={<FormattedMessage id='navigation.developers' defaultMessage='Developers' />}
          />
        )}

        {/* {features.federating ? (
          <NavLink to='/timeline/local' className='btn grouped'>
            <Icon
              src={require('@tabler/icons/icons/users.svg')}
              className={classNames('primary-navigation__icon', { 'svg-icon--active': location.pathname === '/timeline/local' })}
            />
            {instance.get('title')}
          </NavLink>
        ) : (
          <NavLink to='/timeline/local' className='btn grouped'>
            <Icon src={require('@tabler/icons/icons/world.svg')} className='primary-navigation__icon' />
            <FormattedMessage id='tabs_bar.all' defaultMessage='All' />
          </NavLink>
        )}

        {features.federating && (
          <NavLink to='/timeline/fediverse' className='btn grouped'>
            <Icon src={require('icons/fediverse.svg')} className='column-header__icon' />
            <FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />
          </NavLink>
        )} */}
      </div>

      {account && (
        <ComposeButton />
      )}
    </div>
  );
};

export default SidebarNavigation;
