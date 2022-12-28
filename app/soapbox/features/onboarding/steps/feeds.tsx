import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { Button, Card, CardBody } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  col1: { id: 'onboarding.feeds.col1', defaultMessage: 'Here you are on familiar ground: only your publications and those of the people you follow will be displayed on this thread.' },
  col2: { id: 'onboarding.feeds.col2', defaultMessage: 'Here is a bit like your neighborhood: you will only find publications from members of this server, whether you follow them or not.' },
  col3: { id: 'onboarding.feeds.col3', defaultMessage: 'Think outside the box and go explore the rest of the world: this thread displays posts from all known instances.' },
});

const Feeds = ({ onNext } : { onNext: () => void }) => {
  const intl = useIntl();

  const instance = useAppSelector((state) => state.instance);

  return (
    <Card variant='rounded' size='xl'>
      <CardBody>
        <div className='enlistment__step2 mx-auto py-10 px-5'>
          <div className='flex mt-3 gap-4'>
            <div className='flex-grow-1'>
              <h3 className='text-xl font-bold mb-2 text-primary-500'>
                <FormattedMessage id='onboarding.feeds.title1' defaultMessage='Home' />
              </h3>
              <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col1) }} />
              <p className='mt-4 italic'>
                <FormattedMessage id='onboarding.feeds.explanation1' defaultMessage="At first it will be a little empty but don't worry we can help you fill it!" />
              </p>
            </div>
            <div className='flex-grow-1'>
              <h3 className='text-xl font-bold mb-2 text-primary-500'>
                {instance.get('title')}
              </h3>
              <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col2) }} />
              <p className='mt-4 italic'>
                <FormattedMessage id='onboarding.feeds.explanation2' defaultMessage={'We usually call it "local" thread'} />
              </p>
            </div>
            <div className='flex-grow-1'>
              <h3 className='text-xl font-bold mb-2 text-primary-500'>
                <FormattedMessage id='onboarding.feeds.title3' defaultMessage='Explore' />
              </h3>
              <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col3) }} />
              <p className='mt-4 italic'>
                <FormattedMessage id='onboarding.feeds.explanation3' defaultMessage={'We usually call it "global" or "federated" thread'} />
              </p>
            </div>
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

export default Feeds;