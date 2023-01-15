import { List as ImmutableList } from 'immutable';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchAccount } from 'soapbox/actions/accounts';
import { prepareRequest } from 'soapbox/actions/consumer-auth';
import Account from 'soapbox/components/account';
import { Button, Card, CardBody, Stack, Text } from 'soapbox/components/ui';
import VerificationBadge from 'soapbox/components/verification_badge';
import RegistrationForm from 'soapbox/features/auth_login/components/registration_form';
import { useAppDispatch, useAppSelector, useFeatures, useSoapboxConfig } from 'soapbox/hooks';
import { capitalize } from 'soapbox/utils/strings';

const LandingPage = () => {
  const dispatch = useAppDispatch();
  const features = useFeatures();
  const soapboxConfig = useSoapboxConfig();
  const pepeEnabled = soapboxConfig.getIn(['extensions', 'pepe', 'enabled']) === true;

  const instance = useAppSelector((state) => state.instance);
  const accounts = useAppSelector((state) => state.accounts);
  const pepeOpen = useAppSelector(state => state.verification.instance.get('registrations') === true);

  React.useEffect(() => {
    const staff = (instance.pleroma.getIn(['metadata', 'staff_accounts']) as ImmutableList<string>).map((s) => s.split('/').pop());
    staff.forEach((s) => dispatch(fetchAccount(s)));
  }, [instance, dispatch]);

  const staffAccounts = React.useMemo(() => {
    // eslint-disable-next-line eqeqeq
    if (accounts == null) return [];
    const a =  Object.values(accounts?.toJSON()).filter((a) => a.admin || a.moderator);
    return a;
  }, [accounts]);

  const userCount = instance.stats.get('user_count');

  const homeDescription = React.useMemo(() => {
    const format = new Intl.NumberFormat().format(userCount);
    return soapboxConfig.homeDescription.replace('[users]', format);
  }, [userCount, soapboxConfig]);

  /** Registrations are closed */
  const renderClosed = () => {
    return (
      <Stack space={3} data-testid='registrations-closed'>
        <Text size='xl' weight='bold' align='center'>
          <FormattedMessage
            id='registration.closed_title'
            defaultMessage='Registrations Closed'
          />
        </Text>
        <Text theme='muted' align='center'>
          <FormattedMessage
            id='registration.closed_message'
            defaultMessage='{instance} is not accepting new members.'
            values={{ instance: instance.title }}
          />
        </Text>
      </Stack>
    );
  };

  /** Custom Registrations */
  const renderCustom = () => {
    const { customRegProvider } = soapboxConfig;
    const { customRegUrl } = soapboxConfig;
    const onClickUrl = () => {
      window.open(customRegUrl);
    };

    return (
      <Stack space={3}>
        <Stack>
          <Text size='2xl' weight='bold' align='center'>
            <FormattedMessage id='registrations.redirect' defaultMessage='No account yet?' />
          </Text>
        </Stack>

        <Button onClick={onClickUrl} theme='primary' block>
          <FormattedMessage
            id='registration.custom_provider_tooltip'
            defaultMessage='Sign up with {provider}'
            values={{ provider: capitalize(customRegProvider) }}
          />
        </Button>
      </Stack>
    );
  };

  /** Mastodon API registrations are open */
  const renderOpen = () => {
    return <RegistrationForm />;
  };

  /** Display login button for external provider. */
  const renderProvider = () => {
    const { authProvider } = soapboxConfig;

    return (
      <Stack space={3}>
        <Stack>
          <Text size='2xl' weight='bold' align='center'>
            <FormattedMessage id='registrations.get_started' defaultMessage="Let's get started!" />
          </Text>
        </Stack>

        <Button onClick={() => dispatch(prepareRequest(authProvider))} theme='primary' block>
          <FormattedMessage
            id='oauth_consumer.tooltip'
            defaultMessage='Sign in with {provider}'
            values={{ provider: capitalize(authProvider) }}
          />
        </Button>
      </Stack>
    );
  };

  /** Pepe API registrations are open */
  const renderPepe = () => {
    return (
      <Stack space={3} data-testid='registrations-pepe'>
        <VerificationBadge className='h-16 w-16 mx-auto' />

        <Stack>
          <Text size='2xl' weight='bold' align='center'>
            <FormattedMessage id='registrations.get_started' defaultMessage="Let's get started!" />
          </Text>
          <Text theme='muted' align='center'>
            <FormattedMessage id='registrations.tagline' defaultMessage='Social Media Without Discrimination' />
          </Text>
        </Stack>

        <Button to='/verify' theme='primary' block>
          <FormattedMessage id='registrations.create_account' defaultMessage='Create an account' />
        </Button>
      </Stack>
    );
  };

  // Render registration flow depending on features
  const renderBody = () => {
    if (soapboxConfig.authProvider) {
      return renderProvider();
    } else if (pepeEnabled && pepeOpen) {
      return renderPepe();
    } else if (features.accountCreation && instance.registrations) {
      return renderOpen();
    } else if (soapboxConfig.customRegProvider) {
      return renderCustom();
    } else {
      return renderClosed();
    }
  };

  return (
    <main className='mt-16 sm:mt-24' data-testid='homepage'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 py-12'>
          <div className='px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex'>
            <div className='w-full'>
              <Stack space={5}>
                <h1 className='text-5xl font-extrabold text-transparent text-ellipsis overflow-hidden bg-clip-text bg-gradient-to-br from-accent-500 via-primary-500 to-gradient-end sm:mt-5 sm:leading-none lg:mt-6 lg:text-6xl xl:text-7xl'>
                  {instance.title}
                </h1>
                <Text size='lg'>
                  {
                    homeDescription ? <span dangerouslySetInnerHTML={{ __html: homeDescription }} /> : instance.description
                  }
                </Text>
                <div>
                  <div className='flex justify-between'>
                    <h2 className='text-xl text-gray-800 dark:text-gray-300'>
                      <FormattedMessage id='landingPage.admins' defaultMessage='Moderators' />
                    </h2>
                  </div>
                  <a href={`mailto:${instance.email}`}>
                    {instance.email}
                  </a>
                  <Stack space={3} className='mt-4'>
                    {
                      staffAccounts.map((s) => <Account key={s.id} hideActions account={s} />)
                    }
                  </Stack>
                </div>
              </Stack>
            </div>
          </div>
          <div className='sm:mt-24 lg:mt-0 lg:col-span-6 self-center'>
            <Card size='xl' variant='rounded' className='sm:max-w-md sm:w-full sm:mx-auto'>
              <CardBody>
                {renderBody()}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
