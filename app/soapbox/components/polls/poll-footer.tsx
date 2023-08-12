import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchPoll, vote } from 'soapbox/actions/polls';
import { useAppDispatch } from 'soapbox/hooks';

import RelativeTimestamp from '../relative_timestamp';
import { Button, HStack, Stack, Text, Tooltip } from '../ui';

import type { Selected } from './poll';
import type { Poll as PollEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  closed: { id: 'poll.closed', defaultMessage: 'Closed' },
  nonAnonymous: { id: 'poll.non_anonymous.label', defaultMessage: 'Other instances may display the options you voted for' },
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

  const votesCount = <FormattedMessage id='poll.total_votes' defaultMessage='{count, plural, one {# vote} other {# votes}}' values={{ count: poll.get('votes_count') }} />;

  return (
    <Stack space={4} data-testid='poll-footer'>
      {(!showResults && poll?.multiple) && (
        <Button onClick={handleVote} theme='primary' block>
          <FormattedMessage id='poll.vote' defaultMessage='Vote' />
        </Button>
      )}

      <HStack space={1.5} alignItems='center'>
        {poll.pleroma.get('non_anonymous') && (
          <>
            <Tooltip text={intl.formatMessage(messages.nonAnonymous)}>
              <Text tag='span' theme='muted' weight='medium'>
                <FormattedMessage id='poll.non_anonymous' defaultMessage='Public poll' />
              </Text>
            </Tooltip>

            <Text tag='span' theme='muted'>&middot;</Text>
          </>
        )}

        {showResults && (
          <>
            <button className='text-gray-600 underline' onClick={handleRefresh} data-testid='poll-refresh'>
              <Text tag='span' theme='muted' weight='medium'>
                <FormattedMessage id='poll.refresh' defaultMessage='Refresh' />
              </Text>
            </button>

            <Text tag='span' theme='muted'>&middot;</Text>
          </>
        )}

        <Text tag='span' theme='muted' weight='medium'>
          {votesCount}
        </Text>

        {poll.expires_at && (
          <>
            <Text tag='span' theme='muted'>&middot;</Text>
            <Text tag='span' weight='medium' theme='muted' data-testid='poll-expiration'>{timeRemaining}</Text>
          </>
        )}
      </HStack>
    </Stack>
  );
};

export default PollFooter;
