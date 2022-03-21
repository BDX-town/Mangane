import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { Button, Stack, Text } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

const SignUpPanel = () => {
  const soapboxConfig = useAppSelector((state) => getSoapboxConfig(state));
  const siteTitle: string = useAppSelector((state) => state.instance.title);
  const me: boolean | null = useAppSelector((state) => state.me);
  const singleUserMode: boolean = soapboxConfig.get('singleUserMode');

  if (me || singleUserMode) return null;

  return (
    <Stack space={2}>
      <Stack>
        <Text size='lg' weight='bold'>
          <FormattedMessage id='signup_panel.title' defaultMessage='New to {site_title}?' values={{ site_title: siteTitle }} />
        </Text>

        <Text theme='muted'>
          <FormattedMessage id='signup_panel.subtitle' defaultMessage='Sign up now to discuss.' />
        </Text>
      </Stack>

      <Button theme='primary' block to='/'>
        <FormattedMessage id='account.register' defaultMessage='Sign up' />
      </Button>
    </Stack>
  );
};

export default SignUpPanel;
