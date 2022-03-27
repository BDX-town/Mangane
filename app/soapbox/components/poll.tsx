import classNames from 'classnames';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, useIntl, FormattedMessage, IntlShape } from 'react-intl';
import { spring } from 'react-motion';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { vote, fetchPoll } from 'soapbox/actions/polls';
import Icon from 'soapbox/components/icon';
import { Text } from 'soapbox/components/ui';
import Motion from 'soapbox/features/ui/util/optional_motion';

import RelativeTimestamp from './relative_timestamp';

import type { Poll as PollEntity, PollOption as PollOptionEntity } from 'soapbox/types/entities';

const messages = defineMessages({
  closed: { id: 'poll.closed', defaultMessage: 'Closed' },
  voted: { id: 'poll.voted', defaultMessage: 'You voted for this answer' },
  votes: { id: 'poll.votes', defaultMessage: '{votes, plural, one {# vote} other {# votes}}' },
});

const PollPercentageBar: React.FC<{percent: number, leading: boolean}> = ({ percent, leading }): JSX.Element => {
  return (
    <Motion defaultStyle={{ width: 0 }} style={{ width: spring(percent, { stiffness: 180, damping: 12 }) }}>
      {({ width }) =>(
        <span
          className={classNames('poll__chart bg-gray-300 dark:bg-slate-900', {
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

  const handleOptionChange = (): void => {
    onToggle(index);
  };

  const handleOptionKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggle(index);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <label className={classNames('poll__text', { selectable: !showResults })}>
      <input
        name='vote-options'
        type={poll.multiple ? 'checkbox' : 'radio'}
        value={index}
        checked={active}
        onChange={handleOptionChange}
      />

      {!showResults && (
        <span
          className={classNames('poll__input', { checkbox: poll.multiple, active })}
          tabIndex={0}
          role={poll.multiple ? 'checkbox' : 'radio'}
          onKeyPress={handleOptionKeyPress}
          aria-checked={active}
          aria-label={option.title}
          data-index={index}
        />
      )}

      {showResults && (
        <span className='poll__number' title={intl.formatMessage(messages.votes, { votes: option.votes_count })}>
          {!!voted && <Icon src={require('@tabler/icons/icons/check.svg')} className='poll__vote__mark' title={intl.formatMessage(messages.voted)} />}
          {Math.round(percent)}%
        </span>
      )}

      <span dangerouslySetInnerHTML={{ __html: option.title_emojified }} />
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
    <li key={option.title}>
      {showResults && (
        <PollPercentageBar percent={percent} leading={leading} />
      )}

      <PollOptionText percent={percent} {...props} />
    </li>
  );
};

interface IPoll {
  poll?: PollEntity,
  intl: IntlShape,
  dispatch?: Function,
  me?: string | null | false | undefined,
  status?: string,
}

interface IPollState {
  selected: Selected,
}

const RefreshButton: React.FC<{poll: PollEntity}> = ({ poll }): JSX.Element => {
  const dispatch = useDispatch();
  const handleRefresh = () => dispatch(fetchPoll(poll.id));

  return (
    <span>
      <button className='poll__link' onClick={handleRefresh}>
        <Text><FormattedMessage id='poll.refresh' defaultMessage='Refresh' /></Text>
      </button>
    </span>
  );
};

const VoteButton: React.FC<{poll: PollEntity, selected: Selected}> = ({ poll, selected }): JSX.Element => {
  const dispatch = useDispatch();
  const handleVote = dispatch(vote(poll.id, Object.keys(selected)));

  return (
    <button className='button button-secondary' onClick={handleVote}>
      <FormattedMessage id='poll.vote' defaultMessage='Vote' />
    </button>
  );
};

interface IPollFooter {
  poll: PollEntity,
  showResults: boolean,
  selected: Selected,
}

const PollFooter: React.FC<IPollFooter> = ({ poll, showResults, selected }): JSX.Element => {
  const intl = useIntl();
  const timeRemaining = poll.expired ? intl.formatMessage(messages.closed) : <RelativeTimestamp timestamp={poll.expires_at} futureDate />;

  return (
    <div className='poll__footer'>
      {!showResults && <VoteButton poll={poll} selected={selected} />}
      <Text>
        {showResults && (
          <><RefreshButton poll={poll} /> · </>
        )}
        <FormattedMessage id='poll.total_votes' defaultMessage='{count, plural, one {# vote} other {# votes}}' values={{ count: poll.votes_count }} />
        {poll.expires_at && <span> · {timeRemaining}</span>}
      </Text>
    </div>
  );
};

type Selected = Record<number, boolean>;

class Poll extends ImmutablePureComponent<IPoll, IPollState> {

  state = {
    selected: {} as Selected,
  };

  toggleOption = (value: number) => {
    const { me, poll } = this.props;

    if (me) {
      if (poll?.multiple) {
        const tmp = { ...this.state.selected };
        if (tmp[value]) {
          delete tmp[value];
        } else {
          tmp[value] = true;
        }
        this.setState({ selected: tmp });
      } else {
        const tmp: Selected = {};
        tmp[value] = true;
        this.setState({ selected: tmp });
      }
    } else {
      this.openUnauthorizedModal();
    }
  }

  handleVote = () => {
    const { dispatch, poll } = this.props;
    if (!dispatch || !poll) return;
    dispatch(vote(poll.id, Object.keys(this.state.selected)));
  };

  openUnauthorizedModal = () => {
    const { dispatch, status } = this.props;
    if (!dispatch) return;
    dispatch(openModal('UNAUTHORIZED', {
      action: 'POLL_VOTE',
      ap_id: status,
    }));
  }

  render() {
    const { poll } = this.props;
    if (!poll) return null;

    const { selected } = this.state;
    const showResults = poll.voted || poll.expired;

    return (
      <div className={classNames('poll', { voted: poll.voted })}>
        <ul>
          {poll.options.map((option, i) => (
            <PollOption
              key={i}
              poll={poll}
              option={option}
              index={i}
              showResults={showResults}
              active={!!this.state.selected[i]}
              onToggle={this.toggleOption}
            />
          ))}
        </ul>

        <PollFooter
          poll={poll}
          showResults={showResults}
          selected={selected}
        />
      </div>
    );
  }

}

export default injectIntl(Poll);
