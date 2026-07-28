/**
 * Phase 3A — Phone bottom tab navigation for the F7 shell.
 *
 * Provides the same navigation targets as the legacy ThumbNavigation
 * but using Framework7's Toolbar component for proper safe-area handling.
 */
import { Toolbar, Link } from 'framework7-react';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppSelector } from 'soapbox/hooks';

const F7BottomTabs: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const notificationCount = useAppSelector((state) => state.notifications.get('unread'));

  const navigate = (path: string) => () => history.push(path);

  return (
    <Toolbar
      bottom
      tabbar
      className='f7-shell__bottom-tabs'
    >
      <Link
        tabLink
        tabLinkActive={pathname === '/'}
        onClick={navigate('/')}
        iconF7='house_fill'
        text='Home'
      />
      <Link
        tabLink
        tabLinkActive={pathname.startsWith('/search')}
        onClick={navigate('/search')}
        iconF7='search'
        text='Search'
      />
      <Link
        tabLink
        tabLinkActive={pathname.startsWith('/notifications')}
        onClick={navigate('/notifications')}
        iconF7='bell_fill'
        iconBadge={notificationCount > 0 ? notificationCount : undefined}
        text='Alerts'
      />
      <Link
        tabLink
        tabLinkActive={pathname.startsWith('/settings')}
        onClick={navigate('/settings')}
        iconF7='gear'
        text='Settings'
      />
    </Toolbar>
  );
};

export default F7BottomTabs;
