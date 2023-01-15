import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Motion, presets, spring } from 'react-motion';

import { HStack, Icon, Text } from '../ui';

import type {
  Poll as PollEntity,
  PollOption as PollOptionEntity,
} from 'soapbox/types/entities';

const messages = defineMessages({
  voted: { id: 'poll.voted', defaultMessage: 'You voted for this answer' },
  votes: { id: 'poll.votes', defaultMessage: '{votes, plural, one {# vote} other {# votes}}' },
});

const PollPercentageBar: React.FC<{ percent: number, leading: boolean }> = ({ percent, leading }): JSX.Element => {
  return (
    <Motion defaultStyle={{ width: 0 }} style={{ width: spring(percent, { ...presets.gentle, precision: 0.1 }) }}>
      {({ width }) => (
        <span
          className='absolute inset-0 h-full inline-block bg-primary-100 dark:bg-primary-500 rounded-l-md'
          style={{ width: `${width}%` }}
        />
      )}
    </Motion>
  );
};

interface IPollOptionText extends IPollOption {
  percent: number,
}

const PollOptionText: React.FC<IPollOptionText> = ({ poll, option, index, active, onToggle }) => {
  const handleOptionChange: React.EventHandler<React.ChangeEvent> = () => onToggle(index);

  const handleOptionKeyPress: React.EventHandler<React.KeyboardEvent> = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggle(index);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <label
      className={
        classNames('flex relative p-2 bg-white dark:bg-primary-900 cursor-pointer border border-solid hover:bg-primary-50 dark:hover:bg-primary-800/50', {
          'border-primary-600 ring-1 ring-primary-600 bg-primary-50 dark:bg-primary-800/50 dark:border-primary-300 dark:ring-primary-300': active,
          'border-primary-300 dark:border-primary-500': !active,
          'rounded-3xl': poll.multiple !== true,
          'rounded-xl': poll.multiple,
        })
      }
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
          <div className='text-primary-600 dark:text-white'>
            <Text
              theme='inherit'
              weight='medium'
              dangerouslySetInnerHTML={{ __html: option.title_emojified }}
            />
          </div>
        </div>

        <div className='col-start-1 row-start-1 justify-self-end flex items-center'>
          <span
            className={classNames('flex items-center justify-center w-6 h-6 flex-none border border-solid', {
              'bg-primary-600 border-primary-600 dark:bg-primary-300 dark:border-primary-300': active,
              'border-primary-300 bg-white dark:bg-primary-900 dark:border-primary-500': !active,
              'rounded-full': poll.multiple !== true,
              'rounded': poll.multiple,
            })}
            tabIndex={0}
            role={poll.multiple ? 'checkbox' : 'radio'}
            onKeyPress={handleOptionKeyPress}
            aria-checked={active}
            aria-label={option.title}
          >
            {active && (
              <Icon src={require('@tabler/icons/check.svg')} className='text-white dark:text-primary-900 w-4 h-4' />
            )}
          </span>
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
  const { index, poll, option, showResults } = props;

  const intl = useIntl();

  if (!poll) return null;

  const pollVotesCount = poll.votes_count;
  const percent = pollVotesCount === 0 ? 0 : (option.votes_count / pollVotesCount) * 100;
  const leading = poll.options.filterNot(other => other.title === option.title).every(other => option.votes_count >= other.votes_count);
  const voted = poll.own_votes?.includes(index);
  const message = intl.formatMessage(messages.votes, { votes: option.votes_count });

  return (
    <div key={option.title}>
      {showResults ? (
        <div title={voted ? message : undefined}>
          <HStack
            justifyContent='between'
            alignItems='center'
            className='relative p-2 w-full bg-white dark:bg-primary-800 rounded-md overflow-hidden'
          >
            <PollPercentageBar percent={percent} leading={leading} />

            <div className='text-primary-600 dark:text-white'>
              <Text
                theme='inherit'
                weight='medium'
                dangerouslySetInnerHTML={{ __html: option.title_emojified }}
                className='relative'
              />
            </div>

            <HStack space={2} alignItems='center' className='relative'>
              {voted ? (
                <Icon
                  src={require('@tabler/icons/circle-check.svg')}
                  alt={intl.formatMessage(messages.voted)}
                  className='text-primary-600 dark:text-primary-800 dark:fill-white w-4 h-4'
                />
              ) : (
                <div className='svg-icon' />
              )}

              <div className='text-primary-600 dark:text-white'>
                <Text weight='medium' theme='inherit'>{Math.round(percent)}%</Text>
              </div>
            </HStack>
          </HStack>
        </div>
      ) : (
        <PollOptionText percent={percent} {...props} />
      )}
    </div>
  );
};

export default PollOption;
