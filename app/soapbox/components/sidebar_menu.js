import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { logOut, switchAccount } from 'soapbox/actions/auth';
import { fetchOwnAccounts } from 'soapbox/actions/auth';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import Account from 'soapbox/components/account';
import { Stack } from 'soapbox/components/ui';
import ProfileStats from 'soapbox/features/ui/components/profile_stats';
import { getFeatures } from 'soapbox/utils/features';

import { closeSidebar } from '../actions/sidebar';
import { makeGetAccount, makeGetOtherAccounts } from '../selectors';
import { isAdmin, isStaff } from '../utils/accounts';

import { HStack, Icon, IconButton, Text } from './ui';

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domainBlocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
  soapboxConfig: { id: 'navigation_bar.soapbox_config', defaultMessage: 'Soapbox config' },
  importData: { id: 'navigation_bar.import_data', defaultMessage: 'Import data' },
  accountMigration: { id: 'navigation_bar.account_migration', defaultMessage: 'Move account' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
});

const SidebarLink = ({ to, icon, text, onClick }) => (
  <NavLink className='group py-1 rounded-md' to={to} onClick={onClick}>
    <HStack space={2} alignItems='center'>
      <div className='bg-gray-50 relative rounded inline-flex p-2'>
        <Icon src={icon} className='text-primary-600 h-5 w-5' />
      </div>

      <Text tag='span' weight='medium' theme='muted' className='group-hover:text-gray-800'>{text}</Text>
    </HStack>
  </NavLink>
);

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const SidebarMenu = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const logo = useSelector((state) => getSoapboxConfig(state).get('logo'));
  const features = useSelector((state) => getFeatures(state.get('instance')));
  const getAccount = makeGetAccount();
  const getOtherAccounts = makeGetOtherAccounts();
  const me = useSelector((state) => state.get('me'));
  const account = useSelector((state) => getAccount(state, me));
  const otherAccounts = useSelector((state) => getOtherAccounts(state));
  const sidebarOpen = useSelector((state) => state.get('sidebar').sidebarOpen);

  const closeButtonRef = React.useRef(null);

  const [switcher, setSwitcher] = React.useState(false);

  const onClose = () => dispatch(closeSidebar());

  const handleClose = () => {
    setSwitcher(false);
    onClose();
  };

  const handleSwitchAccount = (event, account) => {
    event.preventDefault();
    switchAccount(account);
    dispatch(switchAccount(account.get('id')));
  };

  const onClickLogOut = (event) => {
    event.preventDefault();
    dispatch(logOut(intl));
  };

  const handleSwitcherClick = (e) => {
    e.preventDefault();

    setSwitcher((prevState) => (!prevState));
  };

  const renderAccount = (account) => (
    <a href='/' className='block py-2' onClick={(event) => handleSwitchAccount(event, account)} key={account.get('id')}>
      <Account account={account} showProfileHoverCard={false} />
    </a>
  );

  React.useEffect(() => {
    dispatch(fetchOwnAccounts());
  }, []);

  if (!account) {
    return null;
  }

  const acct = account.get('acct');
  const classes = classNames('sidebar-menu__root', {
    'sidebar-menu__root--visible': sidebarOpen,
  });

  return (
    <div className={classes}>
      <div
        className={classNames({
          'fixed inset-0 bg-gray-600 bg-opacity-90 z-1000': true,
          'hidden': !sidebarOpen,
        })}
        role='button'
        onClick={handleClose}
      />

      <div className='sidebar-menu'>
        <div className='relative overflow-y-scroll overflow-auto h-full w-full'>
          <div className='p-4'>
            <Stack space={4}>
              <HStack alignItems='center' justifyContent='between'>
                <Link to='/' onClick={onClose}>
                  <img alt='Logo' src={logo} className='h-5 w-auto min-w-[140px] cursor-pointer' />
                </Link>

                <IconButton
                  title='close'
                  onClick={handleClose}
                  src={require('@tabler/icons/icons/x.svg')}
                  ref={closeButtonRef}
                  className='text-gray-400 hover:text-gray-600'
                />
              </HStack>

              <Stack space={1}>
                <Link to={`/@${acct}`} onClick={onClose}>
                  <Account account={account} showProfileHoverCard={false} />
                </Link>

                {isStaff(account) && (
                  <Stack>
                    <button type='button' onClick={handleSwitcherClick} className='py-1'>
                      <HStack alignItems='center' justifyContent='between'>
                        <Text tag='span' size='sm' weight='medium'>Switch accounts</Text>

                        <Icon
                          src={switcher ? require('@tabler/icons/icons/chevron-up.svg') : require('@tabler/icons/icons/chevron-down.svg')} className='sidebar-menu-profile__caret'
                        />
                      </HStack>
                    </button>

                    {switcher && (
                      <div className='border-t border-solid border-gray-200'>
                        {otherAccounts.map(account => renderAccount(account))}
                      </div>
                    )}
                  </Stack>
                )}
              </Stack>

              <ProfileStats
                account={account}
                onClickHandler={handleClose}
              />

              <Stack space={2}>
                <hr />

                <SidebarLink
                  to={`/@${acct}`}
                  icon={require('@tabler/icons/icons/user.svg')}
                  text={intl.formatMessage(messages.profile)}
                  onClick={onClose}
                />

                <hr />

                <SidebarLink
                  to='/blocks'
                  icon={require('@tabler/icons/icons/ban.svg')}
                  text={intl.formatMessage(messages.blocks)}
                  onClick={onClose}
                />

                <SidebarLink
                  to='/mutes'
                  icon={require('@tabler/icons/icons/circle-x.svg')}
                  text={intl.formatMessage(messages.mutes)}
                  onClick={onClose}
                />

                <SidebarLink
                  to='/settings/preferences'
                  icon={require('@tabler/icons/icons/settings.svg')}
                  text={intl.formatMessage(messages.preferences)}
                  onClick={onClose}
                />

                {features.federating && (
                  <SidebarLink
                    to='/domain_blocks'
                    icon={require('@tabler/icons/icons/ban.svg')}
                    text={intl.formatMessage(messages.domainBlocks)}
                    onClick={onClose}
                  />
                )}

                {features.filters && (
                  <SidebarLink
                    to='/filters'
                    icon={require('@tabler/icons/icons/filter.svg')}
                    text={intl.formatMessage(messages.filters)}
                    onClick={onClose}
                  />
                )}

                {isAdmin(account) && (
                  <SidebarLink
                    to='/soapbox/config'
                    icon={require('@tabler/icons/icons/settings.svg')}
                    text={intl.formatMessage(messages.soapboxConfig)}
                    onClick={onClose}
                  />
                )}

                {features.importAPI && (
                  <SidebarLink
                    to='/settings/import'
                    icon={require('@tabler/icons/icons/cloud-upload.svg')}
                    text={intl.formatMessage(messages.importData)}
                    onClick={onClose}
                  />
                )}

                {(features.federating && features.accountMoving) && (
                  <SidebarLink
                    to='/settings/migration'
                    icon={require('@tabler/icons/icons/briefcase.svg')}
                    text={intl.formatMessage(messages.accountMigration)}
                    onClick={onClose}
                  />
                )}

                <hr />

                <SidebarLink
                  to='/auth/sign_out'
                  icon='logout'
                  text={intl.formatMessage(messages.logout)}
                  onClick={onClickLogOut}
                />
              </Stack>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
