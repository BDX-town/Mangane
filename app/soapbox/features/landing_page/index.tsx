import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import VerificationBadge from 'soapbox/components/verification_badge';
import RegistrationForm from 'soapbox/features/auth_login/components/registration_form';
import { useAppSelector, useFeatures } from 'soapbox/hooks';

import { Button, Card, CardBody, Stack, Text } from '../../components/ui';

const LandingPage = () => {
  const features = useFeatures();
  const instance = useAppSelector((state) => state.instance);
  const pepeOpen = useAppSelector(state => state.verification.getIn(['instance', 'registrations'], false) === true);

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
            values={{ instance: instance.get('title') }}
          />
        </Text>
      </Stack>
    );
  };

  /** Mastodon API registrations are open */
  const renderOpen = () => {
    return <RegistrationForm />;
  };

  /** Pepe API registrations are open */
  const renderPepe = () => {
    return (
      <Stack space={3} data-testid='registrations-pepe'>
        <VerificationBadge className='h-16 w-16 mx-auto' />

        <Stack>
          <Text size='2xl' weight='bold' align='center'>Let&apos;s get started!</Text>
          <Text theme='muted' align='center'>Social Media Without Discrimination</Text>
        </Stack>

        <Button to='/verify' theme='primary' block>Create an account</Button>
      </Stack>
    );
  };

  // Render registration flow depending on features
  const renderBody = () => {
    if (features.pepe && pepeOpen) {
      return renderPepe();
    } else if (instance.registrations) {
      return renderOpen();
    } else {
      return renderClosed();
    }
  };

  return (
    <main className='mt-16 sm:mt-24' data-testid='homepage'>
      <div className='mx-auto max-w-7xl'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-8 py-12'>
          <div className='px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex'>
            <div>
              <Stack space={3}>
                <h1 className='text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-accent-500 via-primary-500 to-gradient-end sm:mt-5 sm:leading-none lg:mt-6 lg:text-6xl xl:text-7xl'>
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
