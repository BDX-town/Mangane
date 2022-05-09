import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, Card, CardBody, Icon, Stack, Text } from 'soapbox/components/ui';

const CompletedStep = ({ onComplete }: { onComplete: () => void }) => (
  <Card variant='rounded' size='xl'>
    <CardBody>
      <Stack space={2}>
        <Icon strokeWidth={1} src={require('@tabler/icons/icons/confetti.svg')} className='w-16 h-16 mx-auto text-primary-600 dark:text-primary-400' />

        <Text size='2xl' align='center' weight='bold'>
          <FormattedMessage id='onboarding.finished.title' defaultMessage='Onboarding complete' />
        </Text>

        <Text theme='muted' align='center'>
          <FormattedMessage
            id='onboarding.finished.message'
            defaultMessage='We are very excited to welcome you to our community! Tap the button below to get started.'
          />
        </Text>
      </Stack>

      <div className='pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Stack justifyContent='center' space={2}>
          <Button
            block
            theme='primary'
            onClick={onComplete}
          >
            <FormattedMessage id='onboarding.view_feed' defaultMessage='View Feed' />
          </Button>
        </Stack>
      </div>
    </CardBody>
  </Card>
);

export default CompletedStep;
