/**
 * Phase 3A — Phone bottom tab navigation for the F7 shell.
 *
 * Provides the same navigation targets as the legacy ThumbNavigation
 * but using Framework7's Toolbar component for proper safe-area handling.
 */
import { Toolbar, Link } from 'framework7-react';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { SemanticIcon } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

const F7BottomTabs: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const notificationCount = useAppSelector((state) => state.notifications.get('unread'));

  const navigate = (path: string) => () => history.push(path);

  const homeActive = pathname === '/';
  const searchActive = pathname.startsWith('/search');
  const notificationsActive = pathname.startsWith('/notifications');
  const settingsActive = pathname.startsWith('/settings');

  return (
    <Toolbar
      bottom
      tabbar
      className='f7-shell__bottom-tabs'
    >
      <Link
        tabLink
        tabLinkActive={homeActive}
        onClick={navigate('/')}
        text='Home'
      >
        <SemanticIcon name='home' size={24} weight={homeActive ? 'fill' : 'regular'} />
      </Link>
      <Link
        tabLink
        tabLinkActive={searchActive}
        onClick={navigate('/search')}
        text='Search'
      >
        <SemanticIcon name='search' size={24} weight={searchActive ? 'bold' : 'regular'} />
      </Link>
      <Link
        tabLink
        tabLinkActive={notificationsActive}
        onClick={navigate('/notifications')}
        iconBadge={notificationCount > 0 ? notificationCount : undefined}
        text='Alerts'
      >
        <SemanticIcon name='notifications' size={24} weight={notificationsActive ? 'fill' : 'regular'} />
      </Link>
      <Link
        tabLink
        tabLinkActive={settingsActive}
        onClick={navigate('/settings')}
        text='Settings'
      >
        <SemanticIcon name='settings' size={24} weight={settingsActive ? 'fill' : 'regular'} />
      </Link>
    </Toolbar>
  );
};

export default F7BottomTabs;
