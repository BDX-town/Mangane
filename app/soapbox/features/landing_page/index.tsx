import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { prepareRequest } from 'soapbox/actions/consumer-auth';
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
  const pepeOpen = useAppSelector(state => state.verification.instance.get('registrations') === true);

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
              <Stack space={3}>
                <h1 className='text-5xl font-extrabold text-transparent text-ellipsis overflow-hidden bg-clip-text bg-gradient-to-br from-accent-500 via-primary-500 to-gradient-end sm:mt-5 sm:leading-none lg:mt-6 lg:text-6xl xl:text-7xl'>
                  {instance.title}
                </h1>

                <Text size='lg'>
                  {instance.description}
                </Text>
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
