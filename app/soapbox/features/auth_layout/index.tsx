import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';

import LandingGradient from 'soapbox/components/landing-gradient';
import SiteLogo from 'soapbox/components/site-logo';
import { useAppSelector, useFeatures, useSoapboxConfig, useOwnAccount } from 'soapbox/hooks';

import { Button, Card, CardBody } from '../../components/ui';
import LoginPage from '../auth_login/components/login_page';
import PasswordReset from '../auth_login/components/password_reset';
import PasswordResetConfirm from '../auth_login/components/password_reset_confirm';
import RegistrationForm from '../auth_login/components/registration_form';
import ExternalLoginForm from '../external_login/components/external-login-form';
import Footer from '../public_layout/components/footer';
import RegisterInvite from '../register_invite';
import Verification from '../verification';
import EmailPassthru from '../verification/email_passthru';

const messages = defineMessages({
  register: { id: 'auth_layout.register', defaultMessage: 'Create an account' },
});

const AuthLayout = () => {
  const intl = useIntl();
  const history = useHistory();
  const { search } = useLocation();

  const account = useOwnAccount();
  const siteTitle = useAppSelector(state => state.instance.title);
  const soapboxConfig = useSoapboxConfig();
  const pepeEnabled = soapboxConfig.getIn(['extensions', 'pepe', 'enabled']) === true;

  const features = useFeatures();
  const instance = useAppSelector((state) => state.instance);
  const isOpen = features.accountCreation && instance.registrations;
  const pepeOpen = useAppSelector(state => state.verification.instance.get('registrations') === true);
  const isLoginPage = history.location.pathname === '/login';
  const shouldShowRegisterLink = (isLoginPage && (isOpen || (pepeEnabled && pepeOpen)));

  return (
    <div className='h-full'>
      <LandingGradient />

      <main className='relative h-full sm:flex sm:justify-center'>
        <div className='w-full h-full flex flex-col sm:max-w-lg md:max-w-2xl lg:max-w-6xl'>
          <header className='flex justify-between relative py-12 px-2 mb-auto'>
            <div className='relative z-0 flex-1 px-2 lg:flex lg:items-center lg:justify-center lg:absolute lg:inset-0'>
              <Link to='/' className='cursor-pointer'>
                <SiteLogo alt={siteTitle} className='h-7' />
              </Link>
            </div>

            {shouldShowRegisterLink && (
              <div className='relative z-10 ml-auto flex items-center'>
                <Button
                  theme='link'
                  icon={require('@tabler/icons/user.svg')}
                  to='/signup'
                >
                  {intl.formatMessage(messages.register)}
                </Button>
              </div>
            )}
          </header>

          <div className='flex flex-col justify-center items-center'>
            <div className='pb-10 sm:mx-auto w-full sm:max-w-lg md:max-w-2xl'>
              <Card variant='rounded' size='xl'>
                <CardBody>
                  <Switch>
                    {/* If already logged in, redirect home. */}
                    {account && <Redirect from='/login' to='/' exact />}

                    <Route exact path='/verify' component={Verification} />
                    <Route exact path='/verify/email/:token' component={EmailPassthru} />
                    <Route exact path='/login/external' component={ExternalLoginForm} />
                    <Route exact path='/login/add' component={LoginPage} />
                    <Route exact path='/login' component={LoginPage} />
                    <Route exact path='/signup' component={RegistrationForm} />
                    <Route exact path='/reset-password' component={PasswordReset} />
                    <Route exact path='/edit-password' component={PasswordResetConfirm} />
                    <Route path='/invite/:token' component={RegisterInvite} />

                    <Redirect from='/auth/password/new' to='/reset-password' />
                    <Redirect from='/auth/password/edit' to={`/edit-password${search}`} />
                  </Switch>
                </CardBody>
              </Card>
            </div>
          </div>

          <div className='mt-auto'>
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
