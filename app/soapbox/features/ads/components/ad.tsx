import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, HStack, Card, Avatar, Text, Icon } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import type { Card as CardEntity } from 'soapbox/types/entities';

interface IAd {
  card: CardEntity,
}

/** Displays an ad in sponsored post format. */
const Ad: React.FC<IAd> = ({ card }) => {
  const instance = useAppSelector(state => state.instance);

  return (
    <Card className='p-5' variant='rounded'>
      <Stack space={4}>
        <HStack alignItems='center' space={3}>
          <Avatar src={instance.thumbnail} size={42} />

          <Stack>
            <HStack space={1}>
              <Text size='sm' weight='semibold' truncate>
                {instance.title}
              </Text>

              <Icon
                className='w-5 h-5 stroke-accent-500'
                src={require('@tabler/icons/timeline.svg')}
              />
            </HStack>

            <Stack>
              <HStack alignItems='center' space={1}>
                <Text theme='muted' size='sm' truncate>
                  <FormattedMessage id='sponsored.subtitle' defaultMessage='Sponsored post' />
                </Text>
              </HStack>
            </Stack>
          </Stack>
        </HStack>

        {card.image && (
          <a href={card.url} className='rounded-[10px] overflow-hidden' target='_blank'>
            <img className='w-full' src={card.image} alt='' />
          </a>
        )}
      </Stack>
    </Card>
  );
};

export default Ad;
