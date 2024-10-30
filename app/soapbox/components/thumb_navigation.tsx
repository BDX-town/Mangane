import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { usePopper } from 'react-popper';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { getPinnedHosts } from 'soapbox/actions/remote_timeline';
import { openSidebar } from 'soapbox/actions/sidebar';
import ThumbNavigationLink from 'soapbox/components/thumb_navigation-link';
import { Text } from 'soapbox/components/ui';
import { useAppSelector, useLogo, useOwnAccount } from 'soapbox/hooks';
import instance from 'soapbox/reducers/instance';
import { getFeatures } from 'soapbox/utils/features';

import { Avatar } from './ui';

function calculateBottom(node: HTMLElement) {
  if (!node) return 0;
  const { bottom } = node.getBoundingClientRect();
  const height = window.innerHeight;
  return height - bottom;
}

const PinnedHosts = () => {
  const node = useRef<HTMLDivElement>(null);
  const [bottom, setBottom] = useState(0);
  const pinnedHosts = useAppSelector((s) => getPinnedHosts(s));

  useEffect(() => {
    setBottom(calculateBottom(node.current));
    node.current.scrollBy(0, 100000000);
  }, [pinnedHosts]);

  if (pinnedHosts.isEmpty()) return null;


  return (
    <div ref={node} className='overflow-y-auto overscroll-contain' style={{ maxHeight: `calc(100vh - ${bottom}px)` }}>
      <div className='w-max flex flex-col gap-3 pl-4 justify-start items-start'>
        {
          pinnedHosts.sort((a, b) => b.get('host').length - a.get('host').length).map((instance) => (
            <Link className='border-[1px] border-solid border-slate-500 shadow-md bg-white rounded-full dark:bg-slate-900 px-4 py-3  flex items-center gap-2' to={`/timeline/${instance.get('host')}`}>
              <img alt={instance.get('host')} src={instance.get('favicon')} width={16} height={16} />
              <Text size='sm'>{ instance.get('host') }</Text>
            </Link>
          ))
        }
      </div>
    </div>
  );
};

const Communities = () => {

  const features = getFeatures(useAppSelector((state) => state.instance));
  const instance = useAppSelector((state) => state.instance);
  const logo = useLogo();


  return (
    <div className='border-[1px] border-solid border-slate-500 bg-white dark:bg-slate-900 px-3 py-2 rounded-full shadow-md w-max flex gap-2 border-grey-700'>
      {
        features.federating ? (
          <ThumbNavigationLink
            className='py-0'
            src={logo}
            text={instance.get('title')}
            to='/timeline/local'
            exact
          />
        ) : (
          <ThumbNavigationLink
            className='py-0'
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
            className='py-0'
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
            className='py-0'
            src={require('icons/fediverse.svg')}
            text={<FormattedMessage id='tabs_bar.fediverse' defaultMessage='Explore' />}
            to='/timeline/fediverse'
            exact
          />
        )
      }
    </div>
  );
};

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
      className='z-50 flex flex-col gap-3'
      style={styles.popper}
      {...attributes.popper}
    >
      <PinnedHosts />
      <Communities />
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
