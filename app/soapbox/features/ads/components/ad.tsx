import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, HStack, Card, Avatar, Text, Icon } from 'soapbox/components/ui';
import StatusCard from 'soapbox/features/status/components/card';
import { useAppSelector } from 'soapbox/hooks';

import type { Card as CardEntity } from 'soapbox/types/entities';

interface IAd {
  /** Embedded ad data in Card format (almost like OEmbed). */
  card: CardEntity,
  /** Impression URL to fetch upon display. */
  impression?: string,
}

/** Displays an ad in sponsored post format. */
const Ad: React.FC<IAd> = ({ card, impression }) => {
  const instance = useAppSelector(state => state.instance);

  // Fetch the impression URL (if any) upon displaying the ad.
  // It's common for ad providers to provide this.
  useEffect(() => {
    if (impression) {
      fetch(impression);
    }
  }, [impression]);

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

        <StatusCard card={card} onOpenMedia={() => {}} horizontal />
      </Stack>
    </Card>
  );
};

export default Ad;
