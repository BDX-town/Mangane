import { List as ImmutableList } from 'immutable';
import React from 'react';

import { HStack } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import ConsumerButton from './consumer-button';

interface IConsumersList {
}

/** Displays OAuth consumers to log in with. */
const ConsumersList: React.FC<IConsumersList> = () => {
  const providers = useAppSelector(state => ImmutableList<string>(state.instance.pleroma.get('oauth_consumer_strategies')));

  if (providers.size > 0) {
    return (
      <HStack space={2}>
        {providers.map(provider => (
          <ConsumerButton provider={provider} />
        ))}
      </HStack>
    );
  } else {
    return null;
  }
};

export default ConsumersList;
