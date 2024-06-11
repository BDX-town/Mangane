import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { usePopper } from 'react-popper';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { openSidebar } from 'soapbox/actions/sidebar';
import ThumbNavigationLink from 'soapbox/components/thumb_navigation-link';
import { useAppSelector, useLogo, useOwnAccount } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';

import { Avatar } from './ui';

const CommunityTimelineMenu = ({ referenceElement, onClose }: { referenceElement: HTMLElement, onClose: React.MouseEventHandler }) => {
  const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const features = getFeatures(useAppSelector((state) => state.instance));
  const instance = useAppSelector((state) => state.instance);
  const logo = useLogo();

  const handleClickOutside = React.useCallback((e) => {
    if (popperElement.contains(e.target)) return;
    onClose(e);
  }, [popperElement]);

  React.useEffect(() => {
    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  return ReactDOM.createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={setPopperElement}
      onClick={onClose}
      className='bg-white dark:bg-slate-900 px-3 py-2 rounded-full shadow-md w-max z-50 flex gap-2'
      style={styles.popper}
      {...attributes.popper}
    >
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
        features.federating && features.bubbleTimeline && (
          <ThumbNavigationLink
            src={require('@tabler/icons/hexagon.svg')}
            text={<FormattedMessage id='tabs_bar.bubble' defaultMessage='Featured' />}
            to='/timeline/bubble'
            exact
          />
        )
      }

      {
        features.federating && (
          <ThumbNavigationLink
            src={require('icons/fediverse.svg')}
            text={<FormattedMessage id='tabs_bar.fediverse' defaultMessage='Explore' />}
            to='/timeline/fediverse'
            exact
          />
        )
      }
    </div>,
    document.body,
  );
};

const ThumbNavigation: React.FC<{ className?: string }> = ({ className = '', ...props }): JSX.Element => {
  const account = useOwnAccount();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const notificationCount = useAppSelector((state) => state.notifications.unread);

  const [showCommunityMenu, setShowCommunityMenu] = React.useState(null);

  const handleCommunityClick = React.useCallback((e) => {
    e.stopPropagation();
    setShowCommunityMenu(e.currentTarget);
  }, []);

  const onOpenSidebar = React.useCallback(() => dispatch(openSidebar()), [dispatch, openSidebar]);

  // we close community menu when route changes
  React.useEffect(() => {
    setShowCommunityMenu(null);
  }, [pathname]);

  return (
    <>
      <div className={`thumb-navigation flex items-center ${className}`}>
        <ThumbNavigationLink
          src={require('@tabler/icons/home.svg')}
          text={<FormattedMessage id='navigation.home' defaultMessage='Home' />}
          to='/'
          exact
        />

        <ThumbNavigationLink
          active={pathname.startsWith('/timeline')}
          src={require('@tabler/icons/building-community.svg')}
          text={<FormattedMessage id='navigation.community' defaultMessage='Community' />}
          onClick={handleCommunityClick}
        />

        <ThumbNavigationLink
          src={require('@tabler/icons/search.svg')}
          text={<FormattedMessage id='column.search' defaultMessage='Search' />}
          to='/search'
        />


        {account && (
          <>
            <ThumbNavigationLink
              src={require('@tabler/icons/bell.svg')}
              text={<FormattedMessage id='navigation.notifications' defaultMessage='Alerts' />}
              to='/notifications'
              exact
              count={notificationCount}
            />
            <button className='mx-3 bg-transparent border-0' onClick={onOpenSidebar}>
              <Avatar src={account.avatar} size={32} />
            </button>
          </>
        )}

      </div>
      {
        showCommunityMenu && <CommunityTimelineMenu referenceElement={showCommunityMenu} onClose={() => setShowCommunityMenu(null)} />
      }
    </>
  );
};

export default ThumbNavigation;
