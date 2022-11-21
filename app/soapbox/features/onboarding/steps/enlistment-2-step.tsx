import React, { useMemo } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { Avatar, Button, Card, CardBody, Icon, Spinner, Stack, Text } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  right: { id: 'enlistment.step1.right', defaultMessage: 'If you exchange with a person from another instance, you must mention them with their <span class=\'font-bold\'>@pseudo@instance</span><br/><br/> ex: <a href=\' https://oslo.town/@matt\'>@matt@oslo.town</a>, if you want to talk to the Oslo.town admin' },
});

const Enlistment2Step = ({ onNext }: { onNext: () => void }) => {
  const intl = useIntl();

  const instance = useAppSelector((state) => state.instance);

  const contactName = useMemo(() => `@${instance.get('email').replace(/@.+/, '')}`, [instance]);
  const contactUrl = useMemo(() => `${instance.get('uri')}/${contactName}`, [contactName]);

  return (
    <Card variant='rounded' size='xl'>
      <CardBody>
        <div className='enlistment__step1 mx-auto py-10 px-5'>
          <h3 className='text-2xl font-bold'>
            <FormattedMessage id='enlistment.step1.title' defaultMessage='How it works ?' />
          </h3>
          <div className='flex gap-12 mt-2'>
            <div className='flex-grow-1'>
              <p>
                <FormattedMessage
                  id='enlistment.step1.left'
                  defaultMessage='Here you are on {title}. If you exchange with people from the same instance as you, you can simply mention them with {username}{br}{br}ex: {contact}, if you want to talk to the admin of {title}'
                  values={{
                    title: instance.get('title'),
                    username: (
                      <span className='font-bold'><FormattedMessage id='enlistment.step1.username' defaultMessage='@username' /></span>
                    ),
                    contact: (
                      <a href={contactUrl} target='_blank'>
                        {contactName}
                      </a>
                    ),
                    br: <br />,
                  }}
                />
              </p>
            </div>
            <div className='flex-grow-1'>
              <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.right) }} />
            </div>
          </div>
          <div className='italic mt-8'>
            <FormattedMessage id='enlistment.step1.explanation' defaultMessage="Don't worry though, when writing a post, autosuggestion will help you find the right mention! Moreover, if you reply to a post, the mention will automatically be written in the right way." />
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

export default Enlistment2Step;