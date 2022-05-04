import throttle from 'lodash/throttle';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { logOut, switchAccount } from 'soapbox/actions/auth';
import { fetchOwnAccounts } from 'soapbox/actions/auth';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuLink, MenuList } from 'soapbox/components/ui';
import { useAppSelector, useFeatures } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

import Account from '../../../components/account';

import ThemeToggle from './theme-toggle';

import type { Account as AccountEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  add: { id: 'profile_dropdown.add_account', defaultMessage: 'Add an existing account' },
  theme: { id: 'profile_dropdown.theme', defaultMessage: 'Theme' },
  logout: { id: 'profile_dropdown.logout', defaultMessage: 'Log out @{acct}' },
});

interface IProfileDropdown {
  account: AccountEntity
}

type IMenuItem = {
  text: string | React.ReactElement | null
  to?: string
  toggle?: JSX.Element
  icon?: string
  action?: (event: React.MouseEvent) => void
}

const getAccount = makeGetAccount();

const ProfileDropdown: React.FC<IProfileDropdown> = ({ account, children }) => {
  const dispatch = useDispatch();
  const features = useFeatures();
  const intl = useIntl();

  const authUsers = useAppSelector((state) => state.auth.get('users'));
  const otherAccounts = useAppSelector((state) => authUsers.map((authUser: any) => getAccount(state, authUser.get('id'))));

  const handleLogOut = () => {
    dispatch(logOut(intl));
  };

  const handleSwitchAccount = (account: AccountEntity) => {
    return () => {
      dispatch(switchAccount(account.id));
    };
  };

  const fetchOwnAccountThrottled = throttle(() => {
    dispatch(fetchOwnAccounts());
  }, 2000);

  const renderAccount = (account: AccountEntity) => {
    return (
      <Account account={account} showProfileHoverCard={false} hideActions />
    );
  };

  const menu: IMenuItem[] = React.useMemo(() => {
    const menu: IMenuItem[] = [];

    menu.push({ text: renderAccount(account), to: `/@${account.acct}` });

    otherAccounts.forEach((otherAccount: AccountEntity) => {
      if (otherAccount && otherAccount.id !== account.id) {
        menu.push({
          text: renderAccount(otherAccount),
          action: handleSwitchAccount(otherAccount),
        });
      }
    });

    menu.push({ text: null });
    menu.push({ text: intl.formatMessage(messages.theme), toggle: <ThemeToggle /> });
    menu.push({ text: null });

    menu.push({
      text: intl.formatMessage(messages.add),
      to: '/login',
      icon: require('@tabler/icons/icons/plus.svg'),
    });

    menu.push({
      text: intl.formatMessage(messages.logout, { acct: account.acct }),
      to: '/logout',
      action: handleLogOut,
      icon: require('@tabler/icons/icons/logout.svg'),
    });

    return menu;
  }, [account, authUsers, features]);

  React.useEffect(() => {
    fetchOwnAccountThrottled();
  }, [account, authUsers]);

  return (
    <Menu>
      <MenuButton>
        {children}
      </MenuButton>

      <MenuList>
        {menu.map((menuItem, idx) => {
          if (menuItem.toggle) {
            return (
              <div className='flex flex-row items-center justify-between px-4 py-1 text-sm text-gray-700 dark:text-gray-400'>
                <span>{menuItem.text}</span>

                {menuItem.toggle}
              </div>
            );
          } else if (!menuItem.text) {
            return <MenuDivider key={idx} />;
          } else {
            const Comp: any = menuItem.action ? MenuItem : MenuLink;
            const itemProps = menuItem.action ? { onSelect: menuItem.action } : { to: menuItem.to, as: Link };

            return (
              <Comp key={idx} {...itemProps} className='truncate'>
                {menuItem.text}
              </Comp>
            );
          }
        })}
      </MenuList>
    </Menu>
  );
};

export default ProfileDropdown;
