import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
  MenuLink,
  MenuPopoverProps,
} from '@reach/menu-button';
import { positionDefault, positionRight } from '@reach/popover';
import classNames from 'classnames';
import React from 'react';

import './menu.css';

interface IMenuList extends Omit<MenuPopoverProps, 'position'> {
  /** Position of the dropdown menu. */
  position?: 'left' | 'right'

  className?: string,
}

/** Renders children as a dropdown menu. */
const MenuList: React.FC<IMenuList> = ({ className,  position, ...props }) => (
  <MenuPopover
    className={classNames(
      'origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-[1003] dark:border dark:border-solid dark:border-slate-700',
      className,
    )} position={position === 'left' ? positionDefault : positionRight}
  >
    <MenuItems
      onKeyDown={(event) => event.nativeEvent.stopImmediatePropagation()}
      className='py-1 rounded-lg shadow-menu'
      {...props}
    />
  </MenuPopover>
);

/** Divides menu items. */
const MenuDivider = () => <hr />;

export { Menu, MenuButton, MenuDivider, MenuItems, MenuItem, MenuList, MenuLink };
