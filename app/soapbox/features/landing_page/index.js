import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import VerificationBadge from 'soapbox/components/verification_badge';

import { Button, Card, CardBody, HStack, Stack, Text } from '../../components/ui';

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
                  Follow <br /> the Truth
                </h1>
                <Text size='lg'>
                  Truth Social is America&apos;s "Big Tent" social media platform that encourages an open,
                  free, and honest global conversation without discriminating against political ideology.
                </Text>

                <HStack space={2} alignItems='center' className='sm:justify-center lg:justify-start'>
                  <a
                    href='https://apps.apple.com/us/app/truth-social/id1586018825'
                    target='_blank'
                    className='flex w-48 h-16 bg-transparent border border-gray-900 border-solid text-gray-900 rounded-xl items-center justify-center'
                  >
                    <div className='mr-3'>
                      <svg viewBox='0 0 384 512' width='30' >
                        <path fill='currentColor' d='M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z' />
                      </svg>
                    </div>
                    <div>
                      <div className='text-xs'>Download on the</div>
                      <div className='text-2xl font-semibold font-sans -mt-1'>App Store</div>
                    </div>
                  </a>

                  <div className='flex w-48 h-16 opacity-25 bg-transparent border border-gray-900 border-solid text-gray-900 rounded-xl items-center justify-center'>
                    <div className='mr-3'>
                      <svg width='30' height='30' viewBox='0 0 34 34' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M0.798828 16.741C0.798828 7.74655 8.11642 0.428955 17.1109 0.428955C20.7435 0.428955 24.1818 1.59768 27.0541 3.80882L23.2635 8.73289C21.4875 7.36578 19.3599 6.64308 17.1109 6.64308C11.5429 6.64308 7.01295 11.173 7.01295 16.741C7.01295 22.309 11.5429 26.839 17.1109 26.839C21.5955 26.839 25.4064 23.9008 26.7198 19.8481H17.1109V13.634H33.423V16.741C33.423 25.7355 26.1054 33.0531 17.1109 33.0531C8.11642 33.0531 0.798828 25.7355 0.798828 16.741Z' fill='black' />
                      </svg>
                    </div>
                    <div>
                      <div className='text-xs'>Coming soon</div>
                      <div className='text-2xl font-semibold font-sans -mt-1'>Play Store</div>
                    </div>
                  </div>
                </HStack>
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

        <div className='relative mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-6'>
          <div className='lg:grid lg:grid-flow-row-dense lg:grid-cols-3 lg:gap-8 lg:items-start'>
            <div className='lg:col-span-1 lg:mt-24 order-1 lg:order-2'>
              <div className='space-y-3 text-left sm:text-center lg:text-left'>
                <h3 className='text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-600 via-primary-500 to-blue-600 sm:mt-5 sm:leading-none lg:mt-6 lg:text-6xl'>
                  <span>Web +<br className='hidden lg:block' /> Mobile</span>
                </h3>

                <Text size='lg'>
                  TRUTH Social is America&apos;s &quot;Big Tent&quot; social media platform that encourages an open, free, and honest global conversation without discriminating against political ideology.
                </Text>
              </div>
            </div>

            <div className='lg:col-span-2 order-2 lg:order-1'>
              <img
                src='/instance/images/marketing.png'
                alt='Marketing'
                srcSet='/instance/images/marketing@2x.png'
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
