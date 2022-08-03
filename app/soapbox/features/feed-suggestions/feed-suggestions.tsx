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
    <Stack space={3} className='p-4 md:p-0 rounded-md border border-solid border-gray-300 dark:border-gray-800 dark:md:border-transparent md:border-transparent w-52 shrink-0 md:shrink md:w-full'>
      <Link
        to={`/@${account.acct}`}
        title={account.acct}
      >
        <Stack space={3} className='w-40 md:w-24 mx-auto'>
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
  const isLoading = useAppSelector((state) => state.suggestions.isLoading);

  if (!isLoading && suggestedProfiles.size === 0) return null;

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
        <HStack alignItems='center' className='overflow-x-auto lg:overflow-x-hidden space-x-4 md:space-x-0'>
          {suggestedProfiles.slice(0, 4).map((suggestedProfile) => (
            <SuggestionItem key={suggestedProfile.account} accountId={suggestedProfile.account} />
          ))}
        </HStack>
      </CardBody>
    </Card>
  );
};

export default FeedSuggestions;
