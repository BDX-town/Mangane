import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { fetchOwnAccounts, logOut, switchAccount } from 'soapbox/actions/auth';
import { getSettings } from 'soapbox/actions/settings';
import { closeSidebar } from 'soapbox/actions/sidebar';
import Account from 'soapbox/components/account';
import SiteLogo from 'soapbox/components/site-logo';
import { Stack } from 'soapbox/components/ui';
import ProfileStats from 'soapbox/features/ui/components/profile_stats';
import { useAppSelector, useFeatures, useLogo } from 'soapbox/hooks';
import { makeGetAccount, makeGetOtherAccounts } from 'soapbox/selectors';

import { HStack, Icon, IconButton, Text } from './ui';

import type { List as ImmutableList } from 'immutable';
import type { Account as AccountEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  soapboxConfig: { id: 'navigation_bar.soapbox_config', defaultMessage: 'Soapbox config' },
  importData: { id: 'navigation_bar.import_data', defaultMessage: 'Import data' },
  accountMigration: { id: 'navigation_bar.account_migration', defaultMessage: 'Move account' },
  accountAliases: { id: 'navigation_bar.account_aliases', defaultMessage: 'Account aliases' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  bookmarks: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  invites: { id: 'navigation_bar.invites', defaultMessage: 'Invites' },
  developers: { id: 'navigation.developers', defaultMessage: 'Developers' },
  addAccount: { id: 'profile_dropdown.add_account', defaultMessage: 'Add an existing account' },
  direct: { id: 'column.direct', defaultMessage: 'Direct messages' },
  directory: { id: 'navigation_bar.profile_directory', defaultMessage: 'Profile directory' },
  dashboard: { id: 'tabs_bar.dashboard', defaultMessage: 'Dashboard' },
});

interface ISidebarLink {
  href?: string,
  to?: string,
  icon: string,
  text: string | JSX.Element,
  onClick: React.EventHandler<React.MouseEvent>,
}

const SidebarLink: React.FC<ISidebarLink> = ({ href, to, icon, text, onClick }) => {
  const body = (
    <HStack space={2} alignItems='center'>
      <div className='bg-primary-50 dark:bg-slate-700 relative rounded inline-flex p-2'>
        <Icon src={icon} className='text-primary-600 h-5 w-5' />
      </div>

      <Text tag='span' weight='medium' theme='muted' className='group-hover:text-gray-800 dark:group-hover:text-gray-200'>{text}</Text>
    </HStack>
  );

  if (to) {
    return (
      <NavLink className='group py-1 rounded-md' to={to} onClick={onClick}>
        {body}
      </NavLink>
    );
  }

  return (
    <a className='group py-1 rounded-md' href={href} target='_blank' onClick={onClick}>
      {body}
    </a>
  );
};

const getOtherAccounts = makeGetOtherAccounts();

const SidebarMenu: React.FC = (): JSX.Element | null => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const logo = useLogo();
  const features = useFeatures();
  const getAccount = makeGetAccount();
  const instance = useAppSelector((state) => state.instance);
  const me = useAppSelector((state) => state.me);
  const account = useAppSelector((state) => me ? getAccount(state, me) : null);
  const otherAccounts: ImmutableList<AccountEntity> = useAppSelector((state) => getOtherAccounts(state));
  const sidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);
  const settings = useAppSelector((state) => getSettings(state));
  const followRequestsCount = useAppSelector((state) => state.user_lists.follow_requests.items.count());

  const bubbleTimeline = features.bubbleTimeline && settings.getIn(['public', 'bubble']);

  const closeButtonRef = React.useRef(null);

  const [switcher, setSwitcher] = React.useState(false);

  const onClose = () => dispatch(closeSidebar());

  const handleClose = () => {
    setSwitcher(false);
    onClose();
  };

  const handleSwitchAccount = (account: AccountEntity): React.MouseEventHandler => {
    return (e) => {
      e.preventDefault();
      dispatch(switchAccount(account.id));
    };
  };

  const onClickLogOut: React.MouseEventHandler = (e) => {
    e.preventDefault();
    dispatch(logOut());
  };

  const handleSwitcherClick: React.MouseEventHandler = (e) => {
    e.preventDefault();

    setSwitcher((prevState) => (!prevState));
  };

  const renderAccount = (account: AccountEntity) => (
    <a href='#' className='block py-2' onClick={handleSwitchAccount(account)} key={account.id}>
      <div className='pointer-events-none'>
        <Account account={account} showProfileHoverCard={false} withRelationship={false} withLinkToProfile={false} />
      </div>
    </a>
  );

  React.useEffect(() => {
    dispatch(fetchOwnAccounts());
  }, []);

  if (!account) return null;

  return (
    <div className={classNames('sidebar-menu__root', {
      'sidebar-menu__root--visible': sidebarOpen,
    })}
    >
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
                  <SiteLogo alt='Logo' className='h-5 w-auto cursor-pointer' />
                </Link>

                <IconButton
                  title='close'
                  onClick={handleClose}
                  src={require('@tabler/icons/x.svg')}
                  ref={closeButtonRef}
                  className='text-gray-400 hover:text-gray-600'
                />
              </HStack>

              <Stack space={1}>
                <Link to={`/@${account.acct}`} onClick={onClose}>
                  <Account account={account} showProfileHoverCard={false} withLinkToProfile={false} />
                </Link>

                <Stack>
                  <button type='button' onClick={handleSwitcherClick} className='py-1'>
                    <HStack alignItems='center' justifyContent='between'>
                      <Text tag='span' size='sm' weight='medium'>
                        <FormattedMessage id='profile_dropdown.switch_account' defaultMessage='Switch accounts' />
                      </Text>

                      <Icon
                        src={require('@tabler/icons/chevron-down.svg')}
                        className={classNames('text-black dark:text-white transition-transform', {
                          'rotate-180': switcher,
                        })}
                      />
                    </HStack>
                  </button>

                  {switcher && (
                    <div className='border-t border-solid border-gray-200'>
                      {otherAccounts.map(account => renderAccount(account))}

                      <NavLink className='flex py-2 space-x-1' to='/login/add' onClick={handleClose}>
                        <Icon className='dark:text-white' src={require('@tabler/icons/plus.svg')} />
                        <Text>{intl.formatMessage(messages.addAccount)}</Text>
                      </NavLink>
                    </div>
                  )}
                </Stack>
              </Stack>

              <ProfileStats
                account={account}
                onClickHandler={handleClose}
              />

              <Stack space={2}>
                <hr />

                <SidebarLink
                  to={`/@${account.acct}`}
                  icon={require('@tabler/icons/user.svg')}
                  text={intl.formatMessage(messages.profile)}
                  onClick={onClose}
                />


                <SidebarLink
                  to={'/messages'}
                  icon={require('@tabler/icons/mail.svg')}
                  text={intl.formatMessage(messages.direct)}
                  onClick={onClose}
                />

                {features.bookmarks && (
                  <SidebarLink
                    to='/bookmarks'
                    icon={require('@tabler/icons/bookmark.svg')}
                    text={intl.formatMessage(messages.bookmarks)}
                    onClick={onClose}
                  />
                )}

                {features.lists && (
                  <SidebarLink
                    to='/lists'
                    icon={require('@tabler/icons/list.svg')}
                    text={intl.formatMessage(messages.lists)}
                    onClick={onClose}
                  />
                )}

                {features.profileDirectory && (
                  <SidebarLink
                    to='/directory'
                    icon={require('@tabler/icons/folder.svg')}
                    text={intl.formatMessage(messages.directory)}
                    onClick={onClose}
                  />
                )}

                {settings.get('isDeveloper') && (
                  <SidebarLink
                    to='/developers'
                    icon={require('@tabler/icons/code.svg')}
                    text={intl.formatMessage(messages.developers)}
                    onClick={onClose}
                  />
                )}

                {features.publicTimeline && <>
                  <hr className='dark:border-slate-700' />

                  <SidebarLink
                    to='/timeline/local'
                    icon={features.federating ? logo : require('@tabler/icons/world.svg')}
                    text={features.federating ? instance.title : <FormattedMessage id='tabs_bar.all' defaultMessage='All' />}
                    onClick={onClose}
                  />

                  {features.federating && (
                    <SidebarLink
                      to='/timeline/fediverse'
                      icon={!bubbleTimeline ? require('icons/fediverse.svg') : require('@tabler/icons/hexagon.svg')}
                      text={<FormattedMessage id='tabs_bar.fediverse' defaultMessage='Explore' />}
                      onClick={onClose}
                    />
                  )}
                </>}

                <hr />

                {
                  (account.locked || followRequestsCount > 0)  &&
                    <SidebarLink
                      to='/follow_requests'
                      icon={require('@tabler/icons/user-plus.svg')}
                      text={intl.formatMessage(messages.follow_requests)}
                      onClick={onClose}
                    />
                }

                <SidebarLink
                  to='/settings/preferences'
                  icon={require('@tabler/icons/settings.svg')}
                  text={intl.formatMessage(messages.preferences)}
                  onClick={onClose}
                />

                {account.admin && (
                  <SidebarLink
                    to='/soapbox/config'
                    icon={require('@tabler/icons/settings.svg')}
                    text={intl.formatMessage(messages.soapboxConfig)}
                    onClick={onClose}
                  />
                )}

                {account.staff && (
                  <SidebarLink
                    to='/soapbox/admin'
                    icon={require('@tabler/icons/dashboard.svg')}
                    text={intl.formatMessage(messages.dashboard)}
                    onClick={onClose}
                  />
                )}

                {features.import && (
                  <SidebarLink
                    to='/settings/import'
                    icon={require('@tabler/icons/cloud-upload.svg')}
                    text={intl.formatMessage(messages.importData)}
                    onClick={onClose}
                  />
                )}

                <hr />

                <SidebarLink
                  to='/logout'
                  icon={require('@tabler/icons/logout.svg')}
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