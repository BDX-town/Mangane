import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { logOut, switchAccount } from 'soapbox/actions/auth';
import { fetchOwnAccounts } from 'soapbox/actions/auth';
import { getSettings } from 'soapbox/actions/settings';
import { closeSidebar } from 'soapbox/actions/sidebar';
import Account from 'soapbox/components/account';
import SiteLogo from 'soapbox/components/site-logo';
import { Stack } from 'soapbox/components/ui';
import ProfileStats from 'soapbox/features/ui/components/profile_stats';
import { useAppSelector, useFeatures } from 'soapbox/hooks';
import { makeGetAccount, makeGetOtherAccounts } from 'soapbox/selectors';
import { getBaseURL } from 'soapbox/utils/accounts';

import { HStack, Icon, IconButton, Text } from './ui';

import type { List as ImmutableList } from 'immutable';
import type { Account as AccountEntity } from 'soapbox/types/entities';

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
  accountAliases: { id: 'navigation_bar.account_aliases', defaultMessage: 'Account aliases' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  bookmarks: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  invites: { id: 'navigation_bar.invites', defaultMessage: 'Invites' },
  developers: { id: 'navigation.developers', defaultMessage: 'Developers' },
  addAccount: { id: 'profile_dropdown.add_account', defaultMessage: 'Add an existing account' },
});

interface ISidebarLink {
  to: string,
  icon: string,
  text: string | JSX.Element,
  onClick: React.EventHandler<React.MouseEvent>,
}

const SidebarLink: React.FC<ISidebarLink> = ({ to, icon, text, onClick }) => (
  <NavLink className='group py-1 rounded-md' to={to} onClick={onClick}>
    <HStack space={2} alignItems='center'>
      <div className='bg-primary-50 dark:bg-slate-700 relative rounded inline-flex p-2'>
        <Icon src={icon} className='text-primary-600 h-5 w-5' />
      </div>

      <Text tag='span' weight='medium' theme='muted' className='group-hover:text-gray-800 dark:group-hover:text-gray-200'>{text}</Text>
    </HStack>
  </NavLink>
);

const getOtherAccounts = makeGetOtherAccounts();

const SidebarMenu: React.FC = (): JSX.Element | null => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const features = useFeatures();
  const getAccount = makeGetAccount();
  const instance = useAppSelector((state) => state.instance);
  const me = useAppSelector((state) => state.me);
  const account = useAppSelector((state) =>  me ? getAccount(state, me) : null);
  const otherAccounts: ImmutableList<AccountEntity> = useAppSelector((state) => getOtherAccounts(state));
  const sidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);
  const settings = useAppSelector((state) => getSettings(state));

  const baseURL = account ? getBaseURL(account) : '';

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
    dispatch(logOut(intl));
  };

  const handleSwitcherClick: React.MouseEventHandler = (e) => {
    e.preventDefault();

    setSwitcher((prevState) => (!prevState));
  };

  const renderAccount = (account: AccountEntity) => (
    <a href='#' className='block py-2' onClick={handleSwitchAccount(account)} key={account.id}>
      <div className='pointer-events-none'>
        <Account account={account} showProfileHoverCard={false} withRelationship={false} />
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
                  src={require('@tabler/icons/icons/x.svg')}
                  ref={closeButtonRef}
                  className='text-gray-400 hover:text-gray-600'
                />
              </HStack>

              <Stack space={1}>
                <Link to={`/@${account.acct}`} onClick={onClose}>
                  <Account account={account} showProfileHoverCard={false} />
                </Link>

                <Stack>
                  <button type='button' onClick={handleSwitcherClick} className='py-1'>
                    <HStack alignItems='center' justifyContent='between'>
                      <Text tag='span' size='sm' weight='medium'>Switch accounts</Text>

                      <Icon
                        src={require('@tabler/icons/icons/chevron-down.svg')}
                        className={classNames('text-black dark:text-white transition-transform', {
                          'rotate-180': switcher,
                        })}
                      />
                    </HStack>
                  </button>

                  {switcher && (
                    <div className='border-t border-solid border-gray-200'>
                      {otherAccounts.map(account => renderAccount(account))}

                      <NavLink className='flex py-2 space-x-1' to='/login' onClick={handleClose}>
                        <Icon className='dark:text-white' src={require('@tabler/icons/icons/plus.svg')} />
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
                  icon={require('@tabler/icons/icons/user.svg')}
                  text={intl.formatMessage(messages.profile)}
                  onClick={onClose}
                />

                {features.bookmarks && (
                  <SidebarLink
                    to='/bookmarks'
                    icon={require('@tabler/icons/icons/bookmark.svg')}
                    text={intl.formatMessage(messages.bookmarks)}
                    onClick={onClose}
                  />
                )}

                {features.lists && (
                  <SidebarLink
                    to='/lists'
                    icon={require('@tabler/icons/icons/list.svg')}
                    text={intl.formatMessage(messages.lists)}
                    onClick={onClose}
                  />
                )}

                {instance.invites_enabled && (
                  <SidebarLink
                    to={`${baseURL}/invites`}
                    icon={require('@tabler/icons/icons/mailbox.svg')}
                    text={intl.formatMessage(messages.invites)}
                    onClick={onClose}
                  />
                )}

                {settings.get('isDeveloper') && (
                  <SidebarLink
                    to='/developers'
                    icon={require('@tabler/icons/icons/code.svg')}
                    text={intl.formatMessage(messages.developers)}
                    onClick={onClose}
                  />
                )}

                {features.publicTimeline && <>
                  <hr className='dark:border-slate-700' />

                  <SidebarLink
                    to='/timeline/local'
                    icon={features.federating ? require('@tabler/icons/icons/users.svg') : require('@tabler/icons/icons/world.svg')}
                    text={features.federating ? instance.title : <FormattedMessage id='tabs_bar.all' defaultMessage='All' />}
                    onClick={onClose}
                  />

                  {features.federating && (
                    <SidebarLink
                      to='/timeline/fediverse'
                      icon={require('icons/fediverse.svg')}
                      text={<FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />}
                      onClick={onClose}
                    />
                  )}
                </>}

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

                {account.admin && (
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

                {features.federating && (features.accountMoving ? (
                  <SidebarLink
                    to='/settings/migration'
                    icon={require('@tabler/icons/icons/briefcase.svg')}
                    text={intl.formatMessage(messages.accountMigration)}
                    onClick={onClose}
                  />
                ) : features.accountAliasesAPI && (
                  <SidebarLink
                    to='/settings/aliases'
                    icon={require('@tabler/icons/icons/briefcase.svg')}
                    text={intl.formatMessage(messages.accountAliases)}
                    onClick={onClose}
                  />
                ))}

                <hr />

                <SidebarLink
                  to='/logout'
                  icon={require('@tabler/icons/icons/logout.svg')}
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
