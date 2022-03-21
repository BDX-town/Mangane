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
  position?: 'left' | 'right'
}

const MenuList = (props: IMenuList) => (
  <MenuPopover position={props.position === 'left' ? positionDefault : positionRight}>
    <MenuItems
      onKeyDown={(event) => event.nativeEvent.stopImmediatePropagation()}
      className='py-1 bg-white rounded-lg shadow-menu'
      {...props}
    />
  </MenuPopover>
);

const MenuDivider = () => <hr />;

export { Menu, MenuButton, MenuDivider, MenuItems, MenuItem, MenuList, MenuLink };
