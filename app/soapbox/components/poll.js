import classNames from 'classnames';
import escapeTextContentForBrowser from 'escape-html';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import spring from 'react-motion/lib/spring';

import { openModal } from 'soapbox/actions/modal';
import { vote, fetchPoll } from 'soapbox/actions/polls';
import Icon from 'soapbox/components/icon';
import emojify from 'soapbox/features/emoji/emoji';
import Motion from 'soapbox/features/ui/util/optional_motion';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

import RelativeTimestamp from './relative_timestamp';

const messages = defineMessages({
  closed: { id: 'poll.closed', defaultMessage: 'Closed' },
  voted: { id: 'poll.voted', defaultMessage: 'You voted for this answer' },
  votes: { id: 'poll.votes', defaultMessage: '{votes, plural, one {# vote} other {# votes}}' },
});

const makeEmojiMap = record => record.get('emojis').reduce((obj, emoji) => {
  obj[`:${emoji.get('shortcode')}:`] = emoji.toJS();
  return obj;
}, {});

export default @injectIntl
class Poll extends ImmutablePureComponent {

  static propTypes = {
    poll: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    disabled: PropTypes.bool,
    me: SoapboxPropTypes.me,
    status: PropTypes.string,
  };

  state = {
    selected: {},
  };

  _toggleOption = value => {
    if (this.props.me) {
      if (this.props.poll.get('multiple')) {
        const tmp = { ...this.state.selected };
        if (tmp[value]) {
          delete tmp[value];
        } else {
          tmp[value] = true;
        }
        this.setState({ selected: tmp });
      } else {
        const tmp = {};
        tmp[value] = true;
        this.setState({ selected: tmp });
      }
    } else {
      this.openUnauthorizedModal();
    }
  }

  handleOptionChange = ({ target: { value } }) => {
    this._toggleOption(value);
  };

  handleOptionKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      this._toggleOption(e.target.getAttribute('data-index'));
      e.stopPropagation();
      e.preventDefault();
    }
  }

  handleVote = () => {
    if (this.props.disabled) {
      return;
    }

    this.props.dispatch(vote(this.props.poll.get('id'), Object.keys(this.state.selected)));
  };

  openUnauthorizedModal = () => {
    const { dispatch, status } = this.props;
    dispatch(openModal('UNAUTHORIZED', {
      action: 'POLL_VOTE',
      ap_id: status,
    }));
  }

  handleRefresh = () => {
    if (this.props.disabled) {
      return;
    }

    this.props.dispatch(fetchPoll(this.props.poll.get('id')));
  };

  renderOption(option, optionIndex, showResults) {
    const { poll, disabled, intl } = this.props;

    const percent = poll.get('votes_count') === 0 ? 0 : (option.get('votes_count') / poll.get('votes_count')) * 100;
    const leading = poll.get('options').filterNot(other => other.get('title') === option.get('title')).every(other => option.get('votes_count') >= other.get('votes_count'));
    const active  = !!this.state.selected[`${optionIndex}`];
    const voted   = option.get('voted') || (poll.get('own_votes') && poll.get('own_votes').includes(optionIndex));

    let titleEmojified = option.get('title_emojified');
    if (!titleEmojified) {
      const emojiMap = makeEmojiMap(poll);
      titleEmojified = emojify(escapeTextContentForBrowser(option.get('title')), emojiMap);
    }

    return (
      <li key={option.get('title')}>
        {showResults && (
          <Motion defaultStyle={{ width: 0 }} style={{ width: spring(percent, { stiffness: 180, damping: 12 }) }}>
            {({ width }) =>
              <span className={classNames('poll__chart', { leading })} style={{ width: `${width}%` }} />
            }
          </Motion>
        )}

        <label className={classNames('poll__text', { selectable: !showResults })}>
          <input
            name='vote-options'
            type={poll.get('multiple') ? 'checkbox' : 'radio'}
            value={optionIndex}
            checked={active}
            onChange={this.handleOptionChange}
            disabled={disabled}
          />

          {!showResults && (
            <span
              className={classNames('poll__input', { checkbox: poll.get('multiple'), active })}
              tabIndex='0'
              role={poll.get('multiple') ? 'checkbox' : 'radio'}
              onKeyPress={this.handleOptionKeyPress}
              aria-checked={active}
              aria-label={option.get('title')}
              data-index={optionIndex}
            />
          )}
          {showResults && <span className='poll__number' title={intl.formatMessage(messages.votes, { votes: option.get('votes_count') })}>
            {!!voted && <Icon src={require('@tabler/icons/icons/check.svg')} className='poll__vote__mark' title={intl.formatMessage(messages.voted)} />}
            {Math.round(percent)}%
          </span>}

          <span dangerouslySetInnerHTML={{ __html: titleEmojified }} />
        </label>
      </li>
    );
  }

  render() {
    const { me, poll, intl } = this.props;

    if (!poll) {
      return null;
    }

    const timeRemaining = poll.get('expired') ? intl.formatMessage(messages.closed) : <RelativeTimestamp timestamp={poll.get('expires_at')} futureDate />;
    const showResults   = poll.get('voted') || poll.get('expired');
    const disabled      = this.props.disabled || Object.entries(this.state.selected).every(item => !item);
    const voted         = me && poll.get('own_votes').size > 0;

    return (
      <div className={classNames('poll', { voted })}>
        <ul>
          {poll.get('options').map((option, i) => this.renderOption(option, i, showResults))}
        </ul>

        <div className='poll__footer'>
          {!showResults && <button className='button button-secondary' disabled={disabled} onClick={this.handleVote}><FormattedMessage id='poll.vote' defaultMessage='Vote' /></button>}
          {showResults && !this.props.disabled && <span><button className='poll__link' onClick={this.handleRefresh}><FormattedMessage id='poll.refresh' defaultMessage='Refresh' /></button> · </span>}
          <FormattedMessage id='poll.total_votes' defaultMessage='{count, plural, one {# vote} other {# votes}}' values={{ count: poll.get('votes_count') }} />
          {poll.get('expires_at') && <span> · {timeRemaining}</span>}
        </div>
      </div>
    );
  }

}
