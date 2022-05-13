import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, HStack, Stack, Text } from 'soapbox/components/ui';
import { useAppSelector, useSoapboxConfig } from 'soapbox/hooks';

const CtaBanner = () => {
  const { singleUserMode } = useSoapboxConfig();
  const siteTitle = useAppSelector((state) => state.instance.title);
  const me = useAppSelector((state) => state.me);

  if (me || singleUserMode) return null;

  return (
    <div data-testid='cta-banner' className='hidden lg:block fixed bottom-0 left-0 right-0 py-4 backdrop-blur bg-primary-900/80 z-50'>
      <div className='max-w-3xl md:max-w-7xl mx-auto lg:grid lg:grid-cols-12'>
        <div className='col-span-9 col-start-4 xl:col-start-4 xl:col-span-6 md:px-8'>
          <HStack alignItems='center' justifyContent='between'>
            <Stack>
              <Text theme='white' size='xl' weight='bold'>
                <FormattedMessage id='signup_panel.title' defaultMessage='New to {site_title}?' values={{ site_title: siteTitle }} />
              </Text>

              <Text theme='white' weight='medium' className='opacity-90'>
                <FormattedMessage id='signup_panel.subtitle' defaultMessage='Sign up now to discuss.' />
              </Text>
            </Stack>

            <HStack space={2} alignItems='center'>
              <Button theme='secondary' to='/login'>
                <FormattedMessage id='account.login' defaultMessage='Log in' />
              </Button>

              <Button theme='accent' to='/signup'>
                <FormattedMessage id='account.register' defaultMessage='Sign up' />
              </Button>
            </HStack>
          </HStack>
        </div>
      </div>
    </div>
  );
};

export default CtaBanner;
