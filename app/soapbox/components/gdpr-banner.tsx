import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Banner, Button, HStack, Stack, Text } from 'soapbox/components/ui';
import { useAppSelector, useSoapboxConfig } from 'soapbox/hooks';

const acceptedGdpr = !!localStorage.getItem('soapbox:gdpr');

/** Displays a cookie consent banner. */
const GdprBanner: React.FC = () => {
  /** Track whether the banner has already been displayed once. */
  const [shown, setShown] = useState<boolean>(acceptedGdpr);

  const soapbox = useSoapboxConfig();
  const isLoggedIn = useAppSelector(state => !!state.me);
  const siteTitle = useAppSelector(state => state.instance.title);

  const handleAccept = () => {
    localStorage.setItem('soapbox:gdpr', 'true');
    setShown(true);
  };

  const showBanner = soapbox.gdpr && !isLoggedIn && !shown;

  if (!showBanner) {
    return null;
  }

  return (
    <Banner theme='opaque'>
      <Stack space={2}>
        <Stack>
          <Text size='xl' weight='bold'>
            <FormattedMessage id='gdpr.title' defaultMessage='{siteTitle} uses cookies' values={{ siteTitle }} />
          </Text>

          <Text weight='medium' className='opacity-90'>
            <FormattedMessage
              id='gdpr.message'
              defaultMessage="{siteTitle} uses session cookies, which are essential to the website's functioning."
              values={{ siteTitle }}
            />
          </Text>
        </Stack>

        <HStack space={2} justifyContent='end'>
          {soapbox.gdprUrl && (
            <a href={soapbox.gdprUrl} tabIndex={-1} className='inline-flex'>
              <Button theme='secondary'>
                <FormattedMessage id='gdpr.learn_more' defaultMessage='Learn more' />
              </Button>
            </a>
          )}

          <Button theme='accent' onClick={handleAccept}>
            <FormattedMessage id='gdpr.accept' defaultMessage='Accept' />
          </Button>
        </HStack>
      </Stack>
    </Banner>
  );
};

export default GdprBanner;
