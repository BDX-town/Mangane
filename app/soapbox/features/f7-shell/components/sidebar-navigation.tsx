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

import { SemanticIcon } from 'soapbox/components/ui';
import { useAppSelector, useOwnAccount, useFeatures } from 'soapbox/hooks';

import type { SemanticIconName } from 'soapbox/components/ui';

interface NavigationIconProps {
  active: boolean;
  name: SemanticIconName;
}

const NavigationIcon: React.FC<NavigationIconProps> = ({ active, name }) => (
  <span slot='media' aria-hidden='true'>
    <SemanticIcon
      name={name}
      size={22}
      weight={active ? 'fill' : 'regular'}
    />
  </span>
);

const F7SidebarNavigation: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const account = useOwnAccount();
  const features = useFeatures();
  const instance = useAppSelector((state) => state.instance);
  const notificationCount = useAppSelector((state) => state.notifications.get('unread'));

  const navigate = (path: string) => () => history.push(path);
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const homeActive = pathname === '/';
  const localActive = isActive('/timeline/local');
  const exploreActive = isActive('/timeline/fediverse');
  const notificationsActive = isActive('/notifications');
  const bookmarksActive = isActive('/bookmarks');
  const listsActive = isActive('/lists');
  const settingsActive = isActive('/settings');

  return (
    <div className='f7-shell__sidebar-nav'>
      <List menuList>
        <ListItem
          link
          title='Home'
          onClick={navigate('/')}
          selected={homeActive}
        >
          <NavigationIcon name='home' active={homeActive} />
        </ListItem>

        {features.federating && (
          <ListItem
            link
            title={instance.get('title') as string || 'Local'}
            onClick={navigate('/timeline/local')}
            selected={localActive}
          >
            <NavigationIcon name='local' active={localActive} />
          </ListItem>
        )}

        {features.federating && (
          <ListItem
            link
            title='Explore'
            onClick={navigate('/timeline/fediverse')}
            selected={exploreActive}
          >
            <NavigationIcon name='explore' active={exploreActive} />
          </ListItem>
        )}

        {account && (
          <>
            <ListItem
              link
              title='Notifications'
              onClick={navigate('/notifications')}
              selected={notificationsActive}
              badge={notificationCount > 0 ? String(notificationCount) : undefined}
              badgeColor='red'
            >
              <NavigationIcon name='notifications' active={notificationsActive} />
            </ListItem>

            {features.bookmarks && (
              <ListItem
                link
                title='Bookmarks'
                onClick={navigate('/bookmarks')}
                selected={bookmarksActive}
              >
                <NavigationIcon name='bookmark' active={bookmarksActive} />
              </ListItem>
            )}

            {features.lists && (
              <ListItem
                link
                title='Lists'
                onClick={navigate('/lists')}
                selected={listsActive}
              >
                <NavigationIcon name='lists' active={listsActive} />
              </ListItem>
            )}

            <ListItem
              link
              title='Settings'
              onClick={navigate('/settings')}
              selected={settingsActive}
            >
              <NavigationIcon name='settings' active={settingsActive} />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );
};

export default F7SidebarNavigation;
