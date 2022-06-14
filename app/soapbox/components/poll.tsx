import classNames from 'classnames';
import React, { useState } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { spring } from 'react-motion';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { vote, fetchPoll } from 'soapbox/actions/polls';
import { Text, Button, Icon, Stack, HStack } from 'soapbox/components/ui';
import Motion from 'soapbox/features/ui/util/optional_motion';
import { useAppSelector } from 'soapbox/hooks';

import RelativeTimestamp from './relative_timestamp';

import type { Poll as PollEntity, PollOption as PollOptionEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  closed: { id: 'poll.closed', defaultMessage: 'Closed' },
  voted: { id: 'poll.voted', defaultMessage: 'You voted for this answer' },
  votes: { id: 'poll.votes', defaultMessage: '{votes, plural, one {# vote} other {# votes}}' },
});

const PollPercentageBar: React.FC<{ percent: number, leading: boolean }> = ({ percent, leading }): JSX.Element => {
  return (
    <Motion defaultStyle={{ width: 0 }} style={{ width: spring(percent, { stiffness: 180, damping: 12 }) }}>
      {({ width }) => (
        <span
          className={classNames('absolute inset-0 h-full inline-block rounded bg-gray-300 dark:bg-slate-900', {
            'bg-primary-300 dark:bg-primary-400': leading,
          })}
          style={{ width: `${width}%` }}
        />
      )}
    </Motion>
  );
};

interface IPollOptionText extends IPollOption {
  percent: number,
}

const PollOptionText: React.FC<IPollOptionText> = ({ poll, option, index, active, percent, showResults, onToggle }) => {
  const intl = useIntl();
  const voted = poll.own_votes?.includes(index);
  const message = intl.formatMessage(messages.votes, { votes: option.votes_count });

  const handleOptionChange: React.EventHandler<React.ChangeEvent> = () => {
    onToggle(index);
  };

  const handleOptionKeyPress: React.EventHandler<React.KeyboardEvent> = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggle(index);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <label
      className={classNames({
        'relative flex rounded-full border border-solid bg-white p-2 hover:bg-primary-50': true,
        'border-primary-600 ring-1 ring-primary-600 bg-primary-50': active,
        'border-primary-300': !active,
        'cursor-pointer': !showResults,
      })}
      title={showResults ? message : undefined}
    >
      <input
        className='hidden'
        name='vote-options'
        type={poll.multiple ? 'checkbox' : 'radio'}
        value={index}
        checked={active}
        onChange={handleOptionChange}
      />

      <div className='grid items-center w-full'>
        <div className='col-start-1 row-start-1 justify-self-center ml-4 mr-6'>
          <Text
            theme='primary'
            weight='semibold'
            dangerouslySetInnerHTML={{ __html: option.title_emojified }}
          />
        </div>

        <div className='col-start-1 row-start-1 justify-self-end flex items-center'>
          {showResults ? (
            <HStack space={2} alignItems='center' className='mr-2.5'>
              {voted ? (
                <Icon src={require('@tabler/icons/icons/check.svg')} alt={intl.formatMessage(messages.voted)} />
              ) : (
                <div className='svg-icon' />
              )}
              <span className='font-bold'>{Math.round(percent)}%</span>
            </HStack>
          ) : (
            <span
              className={classNames('flex items-center justify-center w-6 h-6 flex-none border border-solid rounded-full', {
                'bg-primary-600 border-primary-600': active,
                'border-primary-300 bg-white': !active,
              })}
              tabIndex={0}
              role={poll.multiple ? 'checkbox' : 'radio'}
              onKeyPress={handleOptionKeyPress}
              aria-checked={active}
              aria-label={option.title}
            >
              {active && (
                <Icon src={require('@tabler/icons/icons/check.svg')} className='text-white w-4 h-4' />
              )}
            </span>
          )}
        </div>
      </div>
    </label>
  );
};

interface IPollOption {
  poll: PollEntity,
  option: PollOptionEntity,
  index: number,
  showResults?: boolean,
  active: boolean,
  onToggle: (value: number) => void,
}

const PollOption: React.FC<IPollOption> = (props): JSX.Element | null => {
  const { poll, option, showResults } = props;
  if (!poll) return null;

  const percent = poll.votes_count === 0 ? 0 : (option.votes_count / poll.votes_count) * 100;
  const leading = poll.options.filterNot(other => other.title === option.title).every(other => option.votes_count >= other.votes_count);

  return (
    <div className='relative' key={option.title}>
      {showResults && (
        <PollPercentageBar percent={percent} leading={leading} />
      )}

      <PollOptionText percent={percent} {...props} />
    </div>
  );
};

const RefreshButton: React.FC<{ poll: PollEntity }> = ({ poll }): JSX.Element => {
  const dispatch = useDispatch();

  const handleRefresh: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(fetchPoll(poll.id));
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <span>
      <button className='underline' onClick={handleRefresh}>
        <Text><FormattedMessage id='poll.refresh' defaultMessage='Refresh' /></Text>
      </button>
    </span>
  );
};

const VoteButton: React.FC<{ poll: PollEntity, selected: Selected }> = ({ poll, selected }): JSX.Element => {
  const dispatch = useDispatch();
  const handleVote = () => dispatch(vote(poll.id, Object.keys(selected)));

  return (
    <Button onClick={handleVote} theme='primary' block>
      <FormattedMessage id='poll.vote' defaultMessage='Vote' />
    </Button>
  );
};

interface IPollFooter {
  poll: PollEntity,
  showResults: boolean,
  selected: Selected,
}

const PollFooter: React.FC<IPollFooter> = ({ poll, showResults, selected }): JSX.Element => {
  const intl = useIntl();
  const timeRemaining = poll.expired ? intl.formatMessage(messages.closed) : <RelativeTimestamp weight='medium' timestamp={poll.expires_at} futureDate />;

  return (
    <Stack space={4}>
      {!showResults && <div><VoteButton poll={poll} selected={selected} /></div>}

      <HStack space={1.5} alignItems='center'>
        {showResults && (
          <>
            <RefreshButton poll={poll} />
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

type Selected = Record<number, boolean>;

interface IPoll {
  id: string,
  status?: string,
}

const Poll: React.FC<IPoll> = ({ id, status }): JSX.Element | null => {
  const dispatch = useDispatch();

  const me = useAppSelector((state) => state.me);
  const poll = useAppSelector((state) => state.polls.get(id));

  const [selected, setSelected] = useState({} as Selected);

  const openUnauthorizedModal = () => {
    dispatch(openModal('UNAUTHORIZED', {
      action: 'POLL_VOTE',
      ap_id: status,
    }));
  };

  const toggleOption = (value: number) => {
    if (me) {
      if (poll?.multiple) {
        const tmp = { ...selected };
        if (tmp[value]) {
          delete tmp[value];
        } else {
          tmp[value] = true;
        }
        setSelected(tmp);
      } else {
        const tmp: Selected = {};
        tmp[value] = true;
        setSelected(tmp);
      }
    } else {
      openUnauthorizedModal();
    }
  };

  if (!poll) return null;

  const showResults = poll.voted || poll.expired;

  return (
    <div onClick={e => e.stopPropagation()}>
      <Stack space={4} className={classNames('mt-4', { voted: poll.voted })}>
        <Stack space={2}>
          {poll.options.map((option, i) => (
            <PollOption
              key={i}
              poll={poll}
              option={option}
              index={i}
              showResults={showResults}
              active={!!selected[i]}
              onToggle={toggleOption}
            />
          ))}
        </Stack>

        <PollFooter
          poll={poll}
          showResults={showResults}
          selected={selected}
        />
      </Stack>
    </div>
  );
};

export default Poll;
