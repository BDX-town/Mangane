import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { Icon, Text } from './ui';

interface ISidebarNavigationLink {
  count?: number,
  icon: string,
  text: string | React.ReactElement,
  to: string,
}

const SidebarNavigationLink = ({ icon, text, to, count }: ISidebarNavigationLink) => {
  const isActive = location.pathname === to;
  const withCounter = typeof count !== 'undefined';

  return (
    <NavLink
      exact
      to={to}
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
          <span className='absolute -top-2 -right-2 block px-1.5 py-0.5 bg-accent-500 text-xs text-white rounded-full ring-2 ring-white'>
            {count}
          </span>
        ) : null}

        <div className='h-5 w-5'>
          <Icon
            src={icon}
            className={classNames({
              'h-full w-full': true,
              'text-primary-700 dark:text-white': !isActive,
              'text-white': isActive,
            })}
          />
        </div>
      </span>

      <Text weight='semibold' theme='inherit'>{text}</Text>
    </NavLink>
  );
};

export default SidebarNavigationLink;
