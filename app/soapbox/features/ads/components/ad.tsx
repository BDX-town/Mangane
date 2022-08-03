import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { Stack, HStack, Card, Tooltip, Avatar, Text, Icon } from 'soapbox/components/ui';
import IconButton from 'soapbox/components/ui/icon-button/icon-button';
import StatusCard from 'soapbox/features/status/components/card';
import { useAppSelector } from 'soapbox/hooks';

import type { Card as CardEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  tooltip: { id: 'sponsored.tooltip', defaultMessage: '{siteTitle} displays ads to help fund our service.' },
});

interface IAd {
  /** Embedded ad data in Card format (almost like OEmbed). */
  card: CardEntity,
  /** Impression URL to fetch upon display. */
  impression?: string,
}

/** Displays an ad in sponsored post format. */
const Ad: React.FC<IAd> = ({ card, impression }) => {
  const intl = useIntl();
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

          <Stack grow>
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

          <Stack justifyContent='center'>
            <Tooltip text={intl.formatMessage(messages.tooltip, { siteTitle: instance.title })}>
              <IconButton
                iconClassName='stroke-gray-600 w-6 h-6'
                src={require('@tabler/icons/info-circle.svg')}
              />
            </Tooltip>
          </Stack>
        </HStack>

        <StatusCard card={card} onOpenMedia={() => {}} horizontal />
      </Stack>
    </Card>
  );
};

export default Ad;
