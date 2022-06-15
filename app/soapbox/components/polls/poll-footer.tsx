import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchPoll, vote } from 'soapbox/actions/polls';
import { useAppDispatch } from 'soapbox/hooks';

import RelativeTimestamp from '../relative_timestamp';
import { Button, HStack, Stack, Text } from '../ui';

import type { Selected } from './poll';
import type { Poll as PollEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  closed: { id: 'poll.closed', defaultMessage: 'Closed' },
});

interface IPollFooter {
  poll: PollEntity,
  showResults: boolean,
  selected: Selected,
}

const PollFooter: React.FC<IPollFooter> = ({ poll, showResults, selected }): JSX.Element => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const handleVote = () => dispatch(vote(poll.id, Object.keys(selected)));

  const handleRefresh: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(fetchPoll(poll.id));
    e.stopPropagation();
    e.preventDefault();
  };

  const timeRemaining = poll.expired ?
    intl.formatMessage(messages.closed) :
    <RelativeTimestamp weight='medium' timestamp={poll.expires_at} futureDate />;

  return (
    <Stack space={4}>
      {(!showResults && poll?.multiple) && (
        <Button onClick={handleVote} theme='primary' block>
          <FormattedMessage id='poll.vote' defaultMessage='Vote' />
        </Button>
      )}

      <HStack space={1.5} alignItems='center'>
        {showResults && (
          <>
            <button className='text-gray-600 underline' onClick={handleRefresh}>
              <Text theme='muted' weight='medium'>
                <FormattedMessage id='poll.refresh' defaultMessage='Refresh' />
              </Text>
            </button>

            <Text theme='muted'>&middot;</Text>
          </>
        )}

        <Text theme='muted' weight='medium'>
          <FormattedMessage
            id='poll.total_votes'
            defaultMessage='{count, plural, one {# vote} other {# votes}}'
            values={{ count: poll.votes_count }}
          />
        </Text>

        {poll.expires_at && (
          <>
            <Text theme='muted'>&middot;</Text>
            <Text weight='medium' theme='muted'>{timeRemaining}</Text>
          </>
        )}
      </HStack>
    </Stack>
  );
};

export default PollFooter;
