import { List as ImmutableList } from 'immutable';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Card, HStack, Text } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import ConsumerButton from './consumer-button';

interface IConsumersList {
}

/** Displays OAuth consumers to log in with. */
const ConsumersList: React.FC<IConsumersList> = () => {
  const providers = useAppSelector(state => ImmutableList<string>(state.instance.pleroma.get('oauth_consumer_strategies')));

  if (providers.size > 0) {
    return (
      <Card className='p-4 sm:rounded-xl bg-gray-50 dark:bg-primary-800'>
        <Text size='xs' theme='muted'>
          <FormattedMessage id='oauth_consumers.title' defaultMessage='Other ways to sign in' />
        </Text>
        <HStack space={2}>
          {providers.map(provider => (
            <ConsumerButton provider={provider} />
          ))}
        </HStack>
      </Card>
    );
  } else {
    return null;
  }
};

export default ConsumersList;
