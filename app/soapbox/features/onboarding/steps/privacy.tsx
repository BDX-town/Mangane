import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, Card, CardBody, Icon } from 'soapbox/components/ui';

const Privacy = ({ onNext } : { onNext : () => void}) => {
  return (
    <Card variant='rounded' size='xl'>
      <CardBody>
        <div className='enlistment__step3 mx-auto py-10 px-5'>
          <div>
            <h3 className='text-2xl font-bold'>
              <FormattedMessage id='onboarding.privacy.title' defaultMessage='Privacy' />
            </h3>
            <p>
              <FormattedMessage id='onboarding.privacy.description' defaultMessage='This site offers precise control over who can see your posts and therefore interact with you.' />
            </p>
          </div>
          <div className='mt-10'>
            <div className='flex gap-4'>
              <div className='flex-grow-1 w-1/2'>
                <h4 className='items-center text-xl font-bold'>
                  <Icon className='inline-block text-primary-500 align-middle mr-1 w-6 h-6' src={require('@tabler/icons/world.svg')} />
                  <span className='align-middle'>
                    <FormattedMessage id='onboarding.privacy.public-title' defaultMessage='Public' />
                  </span>
                </h4>
                <p>
                  <FormattedMessage id='onboarding.privacy.public-description' defaultMessage='The post is displayed on all feeds, including other instances.' />
                </p>
              </div>
              <div className='flex-grow-1 w-1/2'>
                <h4 className='items-center text-xl font-bold'>
                  <Icon className='inline-block text-primary-500 align-middle mr-1 w-6 h-6' src={require('@tabler/icons/eye-off.svg')} />
                  <span className='align-middle'>
                    <FormattedMessage id='onboarding.privacy.unlisted-title' defaultMessage='Unlisted' />
                  </span>
                </h4>
                <p>
                  <FormattedMessage id='onboarding.privacy.unlisted-description' defaultMessage="The post is public but only appears in your subscribers' feeds and on your profile" />
                </p>
              </div>
            </div>
            <div className='mt-10 flex gap-4'>
              <div className='flex-grow-1 w-1/2'>
                <h4 className='items-center text-xl font-bold'>
                  <Icon className='inline-block text-primary-500 align-middle mr-1 w-6 h-6' src={require('@tabler/icons/lock.svg')} />
                  <span className='align-middle'>
                    <FormattedMessage id='onboarding.privacy.followers-title' defaultMessage='Followers only' />
                  </span>
                </h4>
                <p>
                  <FormattedMessage id='onboarding.privacy.followers-description' defaultMessage='The post is not displayed on any public feeds and is only visible to people who follow you' />
                </p>
              </div>
              <div className='flex-grow-1 w-1/2'>
                <h4 className='items-center text-xl font-bold'>
                  <Icon className='inline-block text-primary-500 align-middle mr-1 w-6 h-6' src={require('@tabler/icons/mail.svg')} />
                  <span className='align-middle'>
                    <FormattedMessage id='onboarding.privacy.direct-title' defaultMessage='Direct' />
                  </span>
                </h4>
                <p>
                  <FormattedMessage id='onboarding.privacy.direct-description' defaultMessage='The post is only visible to people mentioned via @username@instance' />
                </p>
              </div>
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

export default Privacy;