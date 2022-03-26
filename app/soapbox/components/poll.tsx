import classNames from 'classnames';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage, IntlShape } from 'react-intl';
import { spring } from 'react-motion';

import { openModal } from 'soapbox/actions/modals';
import { vote, fetchPoll } from 'soapbox/actions/polls';
import Icon from 'soapbox/components/icon';
import { Text } from 'soapbox/components/ui';
import Motion from 'soapbox/features/ui/util/optional_motion';

import RelativeTimestamp from './relative_timestamp';

import type { Poll as PollEntity, PollOption } from 'soapbox/types/entities';

const messages = defineMessages({
  closed: { id: 'poll.closed', defaultMessage: 'Closed' },
  voted: { id: 'poll.voted', defaultMessage: 'You voted for this answer' },
  votes: { id: 'poll.votes', defaultMessage: '{votes, plural, one {# vote} other {# votes}}' },
});

interface IPoll {
  poll?: PollEntity,
  intl: IntlShape,
  dispatch?: Function,
  disabled?: boolean,
  me?: string | null | false | undefined,
  status?: string,
}

interface IPollState {
  selected: Record<string, boolean>,
}

class Poll extends ImmutablePureComponent<IPoll, IPollState> {

  state = {
    selected: {} as Record<string, boolean>,
  };

  _toggleOption = (value: string) => {
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
        const tmp: Record<string, boolean> = {};
        tmp[value] = true;
        this.setState({ selected: tmp });
      }
    } else {
      this.openUnauthorizedModal();
    }
  }

  handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this._toggleOption(e.currentTarget.value);
  };

  handleOptionKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      const dataIndex = e.currentTarget.getAttribute('data-index');

      if (dataIndex) {
        this._toggleOption(dataIndex);
      }

      e.stopPropagation();
      e.preventDefault();
    }
  }

  handleVote = () => {
    const { disabled, dispatch, poll } = this.props;
    if (disabled || !dispatch || !poll) return;
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

  handleRefresh = () => {
    const { disabled, dispatch, poll } = this.props;
    if (disabled || !poll || !dispatch) return;
    dispatch(fetchPoll(poll.id));
  };

  renderOption(option: PollOption, optionIndex: number, showResults: boolean): JSX.Element | null {
    const { poll, disabled, intl } = this.props;
    if (!poll) return null;

    const percent = poll.votes_count === 0 ? 0 : (option.votes_count / poll.votes_count) * 100;
    const leading = poll.options.filterNot(other => other.title === option.title).every(other => option.votes_count >= other.votes_count);
    const active  = !!this.state.selected[`${optionIndex}`];
    const voted   = poll.own_votes?.includes(optionIndex);
    const titleEmojified = option.title_emojified;

    return (
      <li key={option.get('title')}>
        {showResults && (
          <Motion defaultStyle={{ width: 0 }} style={{ width: spring(percent, { stiffness: 180, damping: 12 }) }}>
            {({ width }) =>
              <span className={classNames('poll__chart bg-gray-300 dark:bg-slate-900', { 'bg-primary-300 dark:bg-primary-400': leading })} style={{ width: `${width}%` }} />
            }
          </Motion>
        )}

        <label className={classNames('poll__text', { selectable: !showResults })}>
          <input
            name='vote-options'
            type={poll.multiple ? 'checkbox' : 'radio'}
            value={optionIndex}
            checked={active}
            onChange={this.handleOptionChange}
            disabled={disabled}
          />

          {!showResults && (
            <span
              className={classNames('poll__input', { checkbox: poll.multiple, active })}
              tabIndex={0}
              role={poll.multiple ? 'checkbox' : 'radio'}
              onKeyPress={this.handleOptionKeyPress}
              aria-checked={active}
              aria-label={option.title}
              data-index={optionIndex}
            />
          )}
          {showResults && (
            <span className='poll__number' title={intl.formatMessage(messages.votes, { votes: option.votes_count })}>
              {!!voted && <Icon src={require('@tabler/icons/icons/check.svg')} className='poll__vote__mark' title={intl.formatMessage(messages.voted)} />}
              {Math.round(percent)}%
            </span>
          )}

          <span dangerouslySetInnerHTML={{ __html: titleEmojified }} />
        </label>
      </li>
    );
  }

  render() {
    const { poll, intl } = this.props;

    if (!poll) {
      return null;
    }

    const timeRemaining = poll.expired ? intl.formatMessage(messages.closed) : <RelativeTimestamp timestamp={poll.expires_at} futureDate />;
    const showResults   = poll.voted || poll.expired;
    const disabled      = this.props.disabled || Object.entries(this.state.selected).every(item => !item);

    return (
      <div className={classNames('poll', { voted: poll.voted })}>
        <ul>
          {poll.options.map((option, i) => this.renderOption(option, i, showResults))}
        </ul>

        <div className='poll__footer'>
          {!showResults && <button className='button button-secondary' disabled={disabled} onClick={this.handleVote}><FormattedMessage id='poll.vote' defaultMessage='Vote' /></button>}
          <Text>
            {showResults && !this.props.disabled && (
              <span><button className='poll__link' onClick={this.handleRefresh}>
                <Text><FormattedMessage id='poll.refresh' defaultMessage='Refresh' /></Text>
              </button> · </span>
            )}
            <FormattedMessage id='poll.total_votes' defaultMessage='{count, plural, one {# vote} other {# votes}}' values={{ count: poll.votes_count }} />
            {poll.expires_at && <span> · {timeRemaining}</span>}
          </Text>
        </div>
      </div>
    );
  }

}

export default injectIntl(Poll);
