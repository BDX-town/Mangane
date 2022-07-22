import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { logIn, verifyCredentials } from 'soapbox/actions/auth';
import { fetchInstance } from 'soapbox/actions/instance';
import { openSidebar } from 'soapbox/actions/sidebar';
import SiteLogo from 'soapbox/components/site-logo';
import { Avatar, Button, Form, IconButton, Input, Tooltip } from 'soapbox/components/ui';
import Search from 'soapbox/features/compose/components/search';
import { useOwnAccount, useSoapboxConfig } from 'soapbox/hooks';

import ProfileDropdown from './profile-dropdown';

import type { AxiosError } from 'axios';

const messages = defineMessages({
  login: { id: 'navbar.login.action', defaultMessage: 'Log in' },
  username: { id: 'navbar.login.username.placeholder', defaultMessage: 'Email or username' },
  password: { id: 'navbar.login.password.label', defaultMessage: 'Password' },
  forgotPassword: { id: 'navbar.login.forgot_password', defaultMessage: 'Forgot password?' },
});

const Navbar = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const node = useRef(null);

  const account = useOwnAccount();
  const soapboxConfig = useSoapboxConfig();
  const singleUserMode = soapboxConfig.get('singleUserMode');

  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mfaToken, setMfaToken] = useState<boolean>(false);

  const onOpenSidebar = () => dispatch(openSidebar());

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    dispatch(logIn(username, password) as any)
      .then(({ access_token }: { access_token: string }) => {
        setLoading(false);

        return (
          dispatch(verifyCredentials(access_token) as any)
            // Refetch the instance for authenticated fetch
            .then(() => dispatch(fetchInstance()))
        );
      })
      .catch((error: AxiosError) => {
        setLoading(false);

        const data: any = error.response?.data;
        if (data?.error === 'mfa_required') {
          setMfaToken(data.mfa_token);
        }
      });
  };

  if (mfaToken) return <Redirect to={`/login?token=${encodeURIComponent(mfaToken)}`} />;

  return (
    <nav className='bg-white dark:bg-primary-900 shadow z-50 sticky top-0' ref={node}>
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
            <Link key='logo' to='/' data-preview-title-id='column.home' className='flex-shrink-0 flex items-center'>
              <SiteLogo alt='Logo' className='h-5 w-auto cursor-pointer' />
              <span className='hidden'><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></span>
            </Link>

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
              <>
                <Form className='hidden lg:flex space-x-2 items-center' onSubmit={handleSubmit}>
                  <Input
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    type='text'
                    placeholder={intl.formatMessage(messages.username)}
                    className='max-w-[200px]'
                  />

                  <Input
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type='password'
                    placeholder={intl.formatMessage(messages.password)}
                    className='max-w-[200px]'
                  />

                  <Link to='/reset-password'>
                    <Tooltip text={intl.formatMessage(messages.forgotPassword)}>
                      <IconButton
                        src={require('@tabler/icons/help.svg')}
                        className='bg-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer'
                        iconClassName='w-5 h-5'
                      />
                    </Tooltip>
                  </Link>

                  <Button
                    theme='primary'
                    type='submit'
                    disabled={isLoading}
                  >
                    {intl.formatMessage(messages.login)}
                  </Button>
                </Form>

                <div className='space-x-1.5 lg:hidden'>
                  <Button theme='tertiary' to='/login' size='sm'>
                    <FormattedMessage id='account.login' defaultMessage='Log In' />
                  </Button>

                  {!singleUserMode && (
                    <Button theme='primary' to='/signup' size='sm'>
                      <FormattedMessage id='account.register' defaultMessage='Sign up' />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
