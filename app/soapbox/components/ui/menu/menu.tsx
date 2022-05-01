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
import React from 'react';

import './menu.css';

interface IMenuList extends Omit<MenuPopoverProps, 'position'> {
  /** Position of the dropdown menu. */
  position?: 'left' | 'right'
}

/** Renders children as a dropdown menu. */
const MenuList: React.FC<IMenuList> = (props) => (
  <MenuPopover position={props.position === 'left' ? positionDefault : positionRight}>
    <MenuItems
      onKeyDown={(event) => event.nativeEvent.stopImmediatePropagation()}
      className='py-1 bg-white dark:bg-slate-900 rounded-lg shadow-menu'
      {...props}
    />
  </MenuPopover>
);

/** Divides menu items. */
const MenuDivider = () => <hr />;

export { Menu, MenuButton, MenuDivider, MenuItems, MenuItem, MenuList, MenuLink };
