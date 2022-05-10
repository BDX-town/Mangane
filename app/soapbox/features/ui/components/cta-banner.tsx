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
    <div data-testid='cta-banner' className='hidden lg:block fixed bottom-0 left-0 right-0 py-4 bg-primary-600'>
      <div className='max-w-3xl mx-auto sm:px-6 md:max-w-7xl md:px-8'>
        <HStack alignItems='center' justifyContent='between'>
          <Stack>
            <Text theme='white' size='xl' weight='bold'>
              <FormattedMessage id='signup_panel.title' defaultMessage='New to {site_title}?' values={{ site_title: siteTitle }} />
            </Text>

            <Text theme='white' className='opacity-80'>
              <FormattedMessage id='signup_panel.subtitle' defaultMessage='Sign up now to discuss.' />
            </Text>
          </Stack>

          <Button theme='ghost' to='/'>
            <FormattedMessage id='account.register' defaultMessage='Sign up' />
          </Button>
        </HStack>
      </div>
    </div>
  );
};

export default CtaBanner;
