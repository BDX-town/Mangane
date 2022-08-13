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
        'flex items-center px-4 py-3.5 text-base font-semibold space-x-4 rounded-full group text-gray-600 hover:text-primary-600 dark:text-gray-500 dark:hover:text-gray-100 hover:bg-primary-100 dark:hover:bg-primary-700': true,
        'dark:text-gray-100 text-primary-600': isActive,
      })}
    >
      <span className='relative'>
        <Icon
          src={icon}
          count={count}
          className={classNames('h-5 w-5 group-hover:text-primary-500', {
            'text-primary-500': isActive,
          })}
        />
      </span>

      <Text weight='semibold' theme='inherit'>{text}</Text>
    </NavLink>
  );
});

export default SidebarNavigationLink;
