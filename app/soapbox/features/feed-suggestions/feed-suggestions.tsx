import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import VerificationBadge from 'soapbox/components/verification_badge';
import { useAccount, useAppSelector } from 'soapbox/hooks';

import { Card, CardBody, CardTitle, HStack, Stack, Text } from '../../components/ui';
import ActionButton from '../ui/components/action-button';

import type { Account } from 'soapbox/types/entities';

const messages = defineMessages({
  heading: { id: 'feed_suggestions.heading', defaultMessage: 'Suggested profiles' },
  viewAll: { id: 'feed_suggestions.view_all', defaultMessage: 'View all' },
});

const SuggestionItem = ({ accountId }: { accountId: string }) => {
  const account = useAccount(accountId) as Account;

  return (
    <Stack className='w-24 h-auto' space={3}>
      <Link
        to={`/@${account.acct}`}
        title={account.acct}
      >
        <Stack space={3}>
          <img
            src={account.avatar}
            className='mx-auto block w-16 h-16 min-w-[56px] rounded-full object-cover'
            alt={account.acct}
          />

          <Stack>
            <HStack alignItems='center' justifyContent='center' space={1}>
              <Text
                weight='semibold'
                dangerouslySetInnerHTML={{ __html: account.display_name }}
                truncate
                align='center'
                size='sm'
                className='max-w-[95%]'
              />

              {account.verified && <VerificationBadge />}
            </HStack>

            <Text theme='muted' align='center' size='sm' truncate>@{account.acct}</Text>
          </Stack>
        </Stack>
      </Link>

      <div className='text-center'>
        <ActionButton account={account} />
      </div>
    </Stack>
  );
};

const FeedSuggestions = () => {
  const intl = useIntl();
  const suggestedProfiles = useAppSelector((state) => state.suggestions.items);

  return (
    <Card size='lg' variant='rounded'>
      <HStack justifyContent='between' alignItems='center'>
        <CardTitle title={intl.formatMessage(messages.heading)} />

        <Link
          to='/suggestions'
          className='text-primary-600 dark:text-primary-400 hover:underline'
        >
          {intl.formatMessage(messages.viewAll)}
        </Link>
      </HStack>

      <CardBody>
        <HStack
          alignItems='center'
          justifyContent='around'
          space={8}
        >
          {suggestedProfiles.slice(0, 4).map((suggestedProfile) => (
            <SuggestionItem key={suggestedProfile.account} accountId={suggestedProfile.account} />
          ))}
        </HStack>
      </CardBody>
    </Card>
  );
};

export default FeedSuggestions;
