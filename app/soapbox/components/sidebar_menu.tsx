import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { fetchOwnAccounts, logOut, switchAccount } from 'soapbox/actions/auth';
import { getSettings } from 'soapbox/actions/settings';
import { closeSidebar } from 'soapbox/actions/sidebar';
import Account from 'soapbox/components/account';
import { Stack } from 'soapbox/components/ui';
import ProfileStats from 'soapbox/features/ui/components/profile_stats';
import { useAppSelector, useFeatures } from 'soapbox/hooks';
import { makeGetAccount, makeGetOtherAccounts } from 'soapbox/selectors';

import { Divider, HStack, Icon, IconButton, Text } from './ui';

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
  direct: { id: 'column.direct', defaultMessage: 'Direct messages' },
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
      <div className='bg-primary-50 dark:bg-gray-800 relative rounded-full inline-flex p-2'>
        <Icon src={icon} className='text-primary-500 h-5 w-5' />
      </div>

      <Text tag='span' weight='medium' theme='inherit'>{text}</Text>
    </HStack>
  );

  if (to) {
    return (
      <NavLink className='group rounded-full text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800' to={to} onClick={onClick}>
        {body}
      </NavLink>
    );
  }

  return (
    <a className='group rounded-full text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800' href={href} target='_blank' onClick={onClick}>
      {body}
    </a>
  );
};

const getOtherAccounts = makeGetOtherAccounts();

const SidebarMenu: React.FC = (): JSX.Element | null => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const features = useFeatures();
  const getAccount = makeGetAccount();
  const instance = useAppSelector((state) => state.instance);
  const me = useAppSelector((state) => state.me);
  const account = useAppSelector((state) => me ? getAccount(state, me) : null);
  const otherAccounts: ImmutableList<AccountEntity> = useAppSelector((state) => getOtherAccounts(state));
  const sidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);
  const settings = useAppSelector((state) => getSettings(state));

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
          'fixed inset-0 bg-gray-500/90 dark:bg-gray-700/90 z-1000': true,
          'hidden': !sidebarOpen,
        })}
        role='button'
        onClick={handleClose}
      >
        <IconButton
          title='close'
          onClick={handleClose}
          src={require('@tabler/icons/x.svg')}
          ref={closeButtonRef}
          iconClassName='h-6 w-6'
          className='fixed top-5 right-5 text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        />
      </div>

      <div className='sidebar-menu'>
        <div className='relative overflow-y-scroll overflow-auto h-full w-full'>
          <div className='p-4'>
            <Stack space={4}>
              <Link to={`/@${account.acct}`} onClick={onClose}>
                <Account account={account} showProfileHoverCard={false} withLinkToProfile={false} />
              </Link>

              <ProfileStats
                account={account}
                onClickHandler={handleClose}
              />

              <Stack space={4}>
                <Divider />

                <SidebarLink
                  to={`/@${account.acct}`}
                  icon={require('@tabler/icons/user.svg')}
                  text={intl.formatMessage(messages.profile)}
                  onClick={onClose}
                />


                <SidebarLink
                  to={`/messages`}
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

                {settings.get('isDeveloper') && (
                  <SidebarLink
                    to='/developers'
                    icon={require('@tabler/icons/code.svg')}
                    text={intl.formatMessage(messages.developers)}
                    onClick={onClose}
                  />
                )}

                {features.publicTimeline && <>
                  <Divider />

                  <SidebarLink
                    to='/timeline/local'
                    icon={features.federating ? require('icons/bdx.svg') : require('@tabler/icons/world.svg')}
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

                <Divider />

                <SidebarLink
                  to='/blocks'
                  icon={require('@tabler/icons/ban.svg')}
                  text={intl.formatMessage(messages.blocks)}
                  onClick={onClose}
                />

                <SidebarLink
                  to='/mutes'
                  icon={require('@tabler/icons/circle-x.svg')}
                  text={intl.formatMessage(messages.mutes)}
                  onClick={onClose}
                />

                <SidebarLink
                  to='/settings/preferences'
                  icon={require('@tabler/icons/settings.svg')}
                  text={intl.formatMessage(messages.preferences)}
                  onClick={onClose}
                />

                {features.federating && (
                  <SidebarLink
                    to='/domain_blocks'
                    icon={require('@tabler/icons/ban.svg')}
                    text={intl.formatMessage(messages.domainBlocks)}
                    onClick={onClose}
                  />
                )}

                {features.filters && (
                  <SidebarLink
                    to='/filters'
                    icon={require('@tabler/icons/filter.svg')}
                    text={intl.formatMessage(messages.filters)}
                    onClick={onClose}
                  />
                )}

                {account.admin && (
                  <SidebarLink
                    to='/soapbox/config'
                    icon={require('@tabler/icons/settings.svg')}
                    text={intl.formatMessage(messages.soapboxConfig)}
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

                <Divider />

                <SidebarLink
                  to='/logout'
                  icon={require('@tabler/icons/logout.svg')}
                  text={intl.formatMessage(messages.logout)}
                  onClick={onClickLogOut}
                />

                <Divider />

                <Stack space={4}>
                  <button type='button' onClick={handleSwitcherClick} className='py-1'>
                    <HStack alignItems='center' justifyContent='between'>
                      <Text tag='span'>
                        <FormattedMessage id='profile_dropdown.switch_account' defaultMessage='Switch accounts' />
                      </Text>

                      <Icon
                        src={require('@tabler/icons/chevron-down.svg')}
                        className={classNames('w-4 h-4 text-gray-900 dark:text-gray-100 transition-transform', {
                          'rotate-180': switcher,
                        })}
                      />
                    </HStack>
                  </button>

                  {switcher && (
                    <div className='border-t-2 border-gray-100 dark:border-gray-800 border-solid'>
                      {otherAccounts.map(account => renderAccount(account))}

                      <NavLink className='flex items-center py-2 space-x-1' to='/login/add' onClick={handleClose}>
                        <Icon className='text-primary-500 w-4 h-4' src={require('@tabler/icons/plus.svg')} />
                        <Text size='sm' weight='medium'>{intl.formatMessage(messages.addAccount)}</Text>
                      </NavLink>
                    </div>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
