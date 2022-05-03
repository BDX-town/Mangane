import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { Icon, Text, Counter } from './ui';

interface ISidebarNavigationLink {
  count?: number,
  icon: string,
  text: string | React.ReactElement,
  to?: string,
  onClick?: React.EventHandler<React.MouseEvent>,
}

const SidebarNavigationLink = React.forwardRef((props: ISidebarNavigationLink, ref: React.ForwardedRef<HTMLAnchorElement>): JSX.Element => {
  const { icon, text, to = '', count, onClick } = props;
  const isActive = location.pathname === to;
  const withCounter = typeof count !== 'undefined';

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
        'flex items-center py-2 text-sm font-semibold space-x-4': true,
        'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200': !isActive,
        'text-gray-900 dark:text-white': isActive,
      })}
    >
      <span className={classNames({
        'relative rounded-lg inline-flex p-3': true,
        'bg-primary-50 dark:bg-slate-700': !isActive,
        'bg-primary-600': isActive,
      })}
      >
        {withCounter && count > 0 ? (
          <span className='absolute -top-2 -right-2'>
            <Counter count={count} />
          </span>
        ) : null}

        <Icon
          src={icon}
          className={classNames({
            'h-5 w-5': true,
            'text-primary-700 dark:text-white': !isActive,
            'text-white': isActive,
          })}
        />
      </span>

      <Text weight='semibold' theme='inherit'>{text}</Text>
    </NavLink>
  );
});

export default SidebarNavigationLink;
