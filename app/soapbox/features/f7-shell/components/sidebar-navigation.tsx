/**
 * Phase 3A — F7 Shell sidebar navigation.
 *
 * Renders within the F7 Panel (tablet) or the desktop layout sidebar.
 * Re-uses the same navigation links as the legacy SidebarNavigation but
 * structured for the F7 shell layout.
 */
import { List, ListItem } from 'framework7-react';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppSelector, useOwnAccount, useFeatures } from 'soapbox/hooks';

const F7SidebarNavigation: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const account = useOwnAccount();
  const features = useFeatures();
  const instance = useAppSelector((state) => state.instance);
  const notificationCount = useAppSelector((state) => state.notifications.get('unread'));

  const navigate = (path: string) => () => history.push(path);
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className='f7-shell__sidebar-nav'>
      <List menuList>
        <ListItem
          link
          title='Home'
          onClick={navigate('/')}
          selected={pathname === '/'}
        />

        {features.federating && (
          <ListItem
            link
            title={instance.get('title') as string || 'Local'}
            onClick={navigate('/timeline/local')}
            selected={isActive('/timeline/local')}
          />
        )}

        {features.federating && (
          <ListItem
            link
            title='Explore'
            onClick={navigate('/timeline/fediverse')}
            selected={isActive('/timeline/fediverse')}
          />
        )}

        {account && (
          <>
            <ListItem
              link
              title='Notifications'
              onClick={navigate('/notifications')}
              selected={isActive('/notifications')}
              badge={notificationCount > 0 ? String(notificationCount) : undefined}
              badgeColor='red'
            />

            {features.bookmarks && (
              <ListItem
                link
                title='Bookmarks'
                onClick={navigate('/bookmarks')}
                selected={isActive('/bookmarks')}
              />
            )}

            {features.lists && (
              <ListItem
                link
                title='Lists'
                onClick={navigate('/lists')}
                selected={isActive('/lists')}
              />
            )}

            <ListItem
              link
              title='Settings'
              onClick={navigate('/settings')}
              selected={isActive('/settings')}
            />
          </>
        )}
      </List>
    </div>
  );
};

export default F7SidebarNavigation;
