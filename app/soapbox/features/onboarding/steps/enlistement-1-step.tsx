import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { Avatar, Button, Card, CardBody, Icon, Spinner, Stack, Text } from 'soapbox/components/ui';
import { useOwnAccount, useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  title: { id: 'enlistment.step0.title', defaultMessage: 'Welcome on the Fediverse' },
  body1: { id: 'enlistment.step0.body1', defaultMessage: 'This website is your gateway to a network of independent servers that communicate together to form a larger social network: the fediverse.' },
  body2: { id: 'enlistment.step0.body2', defaultMessage: 'Each server is called an “instance”. Your instance is simply this site: ' },
  username: { id: 'enlistment.step0.username', defaultMessage: 'You full username' },
  explanation: { id: 'enlistment.step0.explanation', defaultMessage: 'It is this identifier that you can share on the fediverse' },
});

const Enlistment1Step = ({ onNext }: { onNext: () => void }) => {
  const intl = useIntl();
  const account = useOwnAccount();
  const instance = useAppSelector((state: any) => state.instance);

  return (
    <Card variant='rounded' size='xl'>
      <CardBody>
        <div className='enlistment__step0 mx-auto py-10 px-5'>
          <h3 className='text-2xl font-bold'>
            {intl.formatMessage(messages.title)}
          </h3>
          <p className='mt-3 mb-5'>
            <div className='text-gray-400 mb-3' dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.body1) }} />
            <span dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.body2) }} />
                &nbsp;
            <span className='font-bold'>
              {instance.get('uri').replace(/https?:\/\//, '')}
            </span>
          </p>

          <h4 className='uppercase text-lg'>
            {intl.formatMessage(messages.username)}
          </h4>

          <div className='enlisted__step0__username inline-block rounded p-1 text-primary-500 text-lg font-bold'>
            @{account?.acct}@{instance.get('uri').replace(/https?:\/\//, '')}
          </div>
          <div className='italic mt-2'>
            {intl.formatMessage(messages.explanation)}
          </div>
        </div>
        <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
          <Button block theme='primary' type='button' onClick={onNext}>
            <FormattedMessage id='onboarding.next' defaultMessage='Next' />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Enlistment1Step;