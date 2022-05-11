import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { Avatar, Button, Icon } from 'soapbox/components/ui';
import Search from 'soapbox/features/compose/components/search';
import { useOwnAccount, useSoapboxConfig, useSettings } from 'soapbox/hooks';

import { openSidebar } from '../../../actions/sidebar';

import ProfileDropdown from './profile-dropdown';

const Navbar = () => {
  const dispatch = useDispatch();
  const node = React.useRef(null);

  const account = useOwnAccount();
  const settings = useSettings();
  const soapboxConfig = useSoapboxConfig();
  const singleUserMode = soapboxConfig.get('singleUserMode');

  // In demo mode, use the Soapbox logo
  const logo = settings.get('demo') ? require('images/soapbox-logo.svg') : soapboxConfig.logo;
  const logoDarkMode = soapboxConfig.logoDarkMode;

  const onOpenSidebar = () => dispatch(openSidebar());

  return (
    <nav className='bg-white dark:bg-slate-800 shadow z-50 sticky top-0' ref={node}>
      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='relative flex justify-between h-12 lg:h-16'>
          {account && (
            <div className='absolute inset-y-0 left-0 flex items-center lg:hidden'>
              <button onClick={onOpenSidebar}>
                <Avatar src={account.avatar} size={34} />
              </button>
            </div>
          )}

          <div
            className={classNames({
              'flex-1 flex items-center lg:items-stretch space-x-4': true,
              'justify-center lg:justify-start': account,
              'justify-start': !account,
            })}
          >
            {logo ? (
              <Link key='logo' to='/' data-preview-title-id='column.home' className='flex-shrink-0 flex items-center'>
                <img alt='Logo' src={logo} className={classNames('h-5 lg:h-6 w-auto cursor-pointer', { 'dark:hidden': logoDarkMode })} />
                {logoDarkMode && (
                  <img alt='Logo' src={logoDarkMode} className='h-5 lg:h-6 w-auto cursor-pointer hidden dark:block' />
                )}

                <span className='hidden'><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></span>
              </Link>
            ) : (
              <Link key='logo' to='/' data-preview-title-id='column.home' className='flex-shrink-0 flex items-center'>
                <Icon alt='Logo' src={require('@tabler/icons/icons/home.svg')} className='h-5 lg:h-6 w-auto text-primary-700' />
                <span className='hidden'><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></span>
              </Link>
            )}

            {account && (
              <div className='flex-1 hidden lg:flex justify-center px-2 lg:ml-6 lg:justify-start items-center'>
                <div className='max-w-xl w-full lg:max-w-xs hidden lg:block'>
                  <Search openInRoute autosuggest />
                </div>
              </div>
            )}
          </div>

          <div className='absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0 space-x-3'>
            {account ? (
              <div className='hidden relative lg:flex items-center'>
                <ProfileDropdown account={account}>
                  <Avatar src={account.avatar} size={34} />
                </ProfileDropdown>
              </div>
            ) : (
              <div className='space-x-1.5'>
                <Button theme='secondary' to='/login' size='sm'>
                  <FormattedMessage id='account.login' defaultMessage='Log In' />
                </Button>

                {!singleUserMode && (
                  <Button theme='primary' to='/signup' size='sm'>
                    <FormattedMessage id='account.register' defaultMessage='Sign up' />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
