import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { Icon, Text } from './ui';

interface ISidebarNavigationLink {
  /** Notification count, if any. */
  count?: number,
  /** URL to an SVG icon. */
  icon: string,
  /** Link label. */
  text: React.ReactElement,
  /** Route to an internal page. */
  to?: string,
  /** Callback when the link is clicked. */
  onClick?: React.EventHandler<React.MouseEvent>,
}

/** Desktop sidebar navigation link. */
const SidebarNavigationLink = React.forwardRef((props: ISidebarNavigationLink, ref: React.ForwardedRef<HTMLAnchorElement>): JSX.Element => {
  const { icon, text, to = '', count, onClick } = props;
  const isActive = location.pathname === to;

  const handleClick: React.EventHandler<React.MouseEvent> = (e) => {
    if (onClick) {
      onClick(e);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <NavLink
      exact
      to={to}
      ref={ref}
      onClick={handleClick}
      className={classNames({
        'flex items-center p-3 text-sm font-semibold space-x-4 rounded-full group hover:bg-primary-200/80 dark:hover:bg-primary-900/60 hover:text-primary-600 dark:hover:text-gray-200': true,
        'text-gray-500 dark:text-gray-400': !isActive,
        'text-primary-600 dark:text-white': isActive,
      })}
    >
      <span className='relative'>
        <Icon
          src={icon}
          count={count}
          className={classNames({
            'h-6 w-6 dark:group-hover:text-primary-500': true,
            'dark:text-primary-500': isActive,
          })}
        />
      </span>

      <Text weight='semibold' theme='inherit'>{text}</Text>
    </NavLink>
  );
});

export default SidebarNavigationLink;
