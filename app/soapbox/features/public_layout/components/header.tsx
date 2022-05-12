import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { logIn, verifyCredentials } from 'soapbox/actions/auth';
import { fetchInstance } from 'soapbox/actions/instance';
import SiteLogo from 'soapbox/components/site-logo';
import { useAppSelector, useFeatures, useSoapboxConfig } from 'soapbox/hooks';

import { openModal } from '../../../actions/modals';
import { Button, Form, HStack, IconButton, Input, Tooltip } from '../../../components/ui';

import Sonar from './sonar';

import type { AxiosError } from 'axios';

const messages = defineMessages({
  home: { id: 'header.home.label', defaultMessage: 'Home' },
  login: { id: 'header.login.label', defaultMessage: 'Log in' },
  register: { id: 'header.register.label', defaultMessage: 'Register' },
  username: { id: 'header.login.username.placeholder', defaultMessage: 'Email or username' },
  password: { id: 'header.login.password.label', defaultMessage: 'Password' },
  forgotPassword: { id: 'header.login.forgot_password', defaultMessage: 'Forgot password?' },
});

const Header = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const soapboxConfig = useSoapboxConfig();
  const pepeEnabled = soapboxConfig.getIn(['extensions', 'pepe', 'enabled']) === true;
  const { links } = soapboxConfig;

  const features = useFeatures();
  const instance = useAppSelector((state) => state.instance);
  const isOpen = features.accountCreation && instance.registrations;
  const pepeOpen = useAppSelector(state => state.verification.getIn(['instance', 'registrations'], false) === true);

  const [isLoading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [shouldRedirect, setShouldRedirect] = React.useState(false);
  const [mfaToken, setMfaToken] = React.useState(false);

  const open = () => dispatch(openModal('LANDING_PAGE'));

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    dispatch(logIn(intl, username, password) as any)
      .then(({ access_token }: { access_token: string }) => {
        return (
          dispatch(verifyCredentials(access_token) as any)
            // Refetch the instance for authenticated fetch
            .then(() => dispatch(fetchInstance()))
            .then(() => setShouldRedirect(true))
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

  if (shouldRedirect) return <Redirect to='/' />;
  if (mfaToken) return <Redirect to={`/login?token=${encodeURIComponent(mfaToken)}`} />;

  return (
    <header>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' aria-label='Header'>
        <div className='w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none'>
          <div className='flex items-center sm:justify-center relative w-36'>
            <div className='hidden sm:block absolute z-0 -top-24 -left-6'>
              <Sonar />
            </div>
            <Link to='/' className='z-10'>
              <SiteLogo alt='Logo' className='h-6 w-auto cursor-pointer' />
              <span className='hidden'>{intl.formatMessage(messages.home)}</span>
            </Link>
          </div>
          <div className='ml-10 flex space-x-6 items-center relative z-10'>
            <IconButton
              title='Open Menu'
              src={require('@tabler/icons/icons/menu-2.svg')}
              onClick={open}
              className='md:hidden bg-transparent text-gray-400 hover:text-gray-600'
            />

            <div className='hidden md:flex items-center space-x-6'>
              <HStack space={6} alignItems='center'>
                {links.get('help') && (
                  <a
                    href={links.get('help')}
                    target='_blank'
                    className='text-sm font-medium text-gray-500 hover:text-gray-900'
                  >
                    <FormattedMessage id='landing_page_modal.helpCenter' defaultMessage='Help Center' />
                  </a>
                )}
              </HStack>

              <HStack space={2} className='xl:hidden'>
                <Button to='/login' theme='secondary'>
                  {intl.formatMessage(messages.login)}
                </Button>

                {(isOpen || pepeEnabled && pepeOpen) && (
                  <Button
                    to='/signup'
                    theme='primary'
                  >
                    {intl.formatMessage(messages.register)}
                  </Button>
                )}
              </HStack>
            </div>

            <Form className='hidden xl:flex space-x-2 items-center' onSubmit={handleSubmit}>
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
                    src={require('@tabler/icons/icons/help.svg')}
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
