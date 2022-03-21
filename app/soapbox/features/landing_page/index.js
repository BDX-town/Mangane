import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import VerificationBadge from 'soapbox/components/verification_badge';

import { Button, Card, CardBody, Stack, Text } from '../../components/ui';

const LandingPage = () => {
  const instance = useSelector((state) => state.get('instance'));
  const isOpen = useSelector(state => state.getIn(['verification', 'instance', 'registrations'], false) === true);

  const renderClosed = () => {
    return (
      <Stack space={3}>
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

  return (
    <main className='mt-16 sm:mt-24'>
      <div className='mx-auto max-w-7xl'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-8 items-center py-24'>
          <div className='px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center'>
            <div>
              <Stack space={3}>
                <h1 className='text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-600 via-primary-500 to-blue-600 sm:mt-5 sm:leading-none lg:mt-6 lg:text-6xl xl:text-7xl'>
                  {instance.title}
                </h1>
                <Text size='lg'>
                  {instance.description}
                </Text>
              </Stack>
            </div>
          </div>
          <div className='hidden lg:block sm:mt-24 lg:mt-0 lg:col-span-6'>
            <Card size='xl' variant='rounded' className='sm:max-w-md sm:w-full sm:mx-auto'>
              <CardBody>
                {isOpen ? (
                  <Stack space={3}>
                    <VerificationBadge className='h-16 w-16 mx-auto' />

                    <Stack>
                      <Text size='2xl' weight='bold' align='center'>Let&apos;s get started!</Text>
                      <Text theme='muted' align='center'>Social Media Without Discrimination</Text>
                    </Stack>

                    <Button to='/auth/verify' theme='primary' block>Create an account</Button>
                  </Stack>
                ) : renderClosed()}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
