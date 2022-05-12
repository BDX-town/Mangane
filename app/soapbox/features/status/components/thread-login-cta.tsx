import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Card, CardTitle, Text, Stack, Button } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

/** Prompts logged-out users to log in when viewing a thread. */
const ThreadLoginCta: React.FC = () => {
  const siteTitle = useAppSelector(state => state.instance.title);

  return (
    <Card className='px-6 py-12 space-y-6 text-center' variant='rounded'>
      <Stack>
        <CardTitle title={<FormattedMessage id='thread_login.title' defaultMessage='Continue the conversation' />} />
        <Text>
          <FormattedMessage
            id='thread_login.message'
            defaultMessage='Join {siteTitle} to get the full story and details.'
            values={{ siteTitle }}
          />
        </Text>
      </Stack>

      <Stack space={4} className='max-w-xs mx-auto'>
        <Button theme='secondary' to='/login' block>
          <FormattedMessage id='thread_login.login' defaultMessage='Log in' />
        </Button>
        <Button to='/signup' block>
          <FormattedMessage id='thread_login.signup' defaultMessage='Sign up' />
        </Button>
      </Stack>
    </Card>
  );
};

export default ThreadLoginCta;
