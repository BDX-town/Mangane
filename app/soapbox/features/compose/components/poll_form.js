'use strict';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import AutosuggestInput from 'soapbox/components/autosuggest_input';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';

const messages = defineMessages({
  option_placeholder: { id: 'compose_form.poll.option_placeholder', defaultMessage: 'Choice {number}' },
  add_option: { id: 'compose_form.poll.add_option', defaultMessage: 'Add a choice' },
  remove_option: { id: 'compose_form.poll.remove_option', defaultMessage: 'Remove this choice' },
  poll_duration: { id: 'compose_form.poll.duration', defaultMessage: 'Poll duration' },
  switchToMultiple: { id: 'compose_form.poll.switch_to_multiple', defaultMessage: 'Change poll to allow multiple choices' },
  switchToSingle: { id: 'compose_form.poll.switch_to_single', defaultMessage: 'Change poll to allow for a single choice' },
  minutes: { id: 'intervals.full.minutes', defaultMessage: '{number, plural, one {# minute} other {# minutes}}' },
  hours: { id: 'intervals.full.hours', defaultMessage: '{number, plural, one {# hour} other {# hours}}' },
  days: { id: 'intervals.full.days', defaultMessage: '{number, plural, one {# day} other {# days}}' },
});

@injectIntl
class Option extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    isPollMultiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onToggleMultiple: PropTypes.func.isRequired,
    suggestions: ImmutablePropTypes.list,
    onClearSuggestions: PropTypes.func.isRequired,
    onFetchSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    maxChars: PropTypes.number.isRequired,
    onRemovePoll: PropTypes.func.isRequired,
    numOptions: PropTypes.number.isRequired,
  };

  handleOptionTitleChange = e => {
    this.props.onChange(this.props.index, e.target.value);
  };

  handleOptionRemove = () => {
    if (this.props.numOptions > 2)
      this.props.onRemove(this.props.index);
    else
      this.props.onRemovePoll();
  };

  handleToggleMultiple = e => {
    this.props.onToggleMultiple();
    e.preventDefault();
    e.stopPropagation();
  };

  onSuggestionsClearRequested = () => {
    this.props.onClearSuggestions();
  }

  handleCheckboxKeypress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.handleToggleMultiple(e);
    }
  }

  onSuggestionsFetchRequested = (token) => {
    this.props.onFetchSuggestions(token);
  }

  onSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['poll', 'options', this.props.index]);
  }

  render() {
    const { isPollMultiple, title, index, maxChars, intl } = this.props;

    return (
      <li>
        <label className='poll__text editable'>
          <span
            className={classNames('poll__input', { checkbox: isPollMultiple })}
            onClick={this.handleToggleMultiple}
            onKeyPress={this.handleCheckboxKeypress}
            role='button'
            tabIndex='0'
            title={intl.formatMessage(isPollMultiple ? messages.switchToSingle : messages.switchToMultiple)}
            aria-label={intl.formatMessage(isPollMultiple ? messages.switchToSingle : messages.switchToMultiple)}
          />

          <AutosuggestInput
            placeholder={intl.formatMessage(messages.option_placeholder, { number: index + 1 })}
            maxLength={maxChars}
            value={title}
            onChange={this.handleOptionTitleChange}
            suggestions={this.props.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            searchTokens={[':']}
            autoFocus
          />
        </label>

        <div className='poll__cancel'>
          <IconButton title={intl.formatMessage(messages.remove_option)} src={require('@tabler/icons/icons/x.svg')} onClick={this.handleOptionRemove} />
        </div>
      </li>
    );
  }

}

class PollForm extends ImmutablePureComponent {

  static propTypes = {
    options: ImmutablePropTypes.list,
    expiresIn: PropTypes.number,
    isMultiple: PropTypes.bool,
    onChangeOption: PropTypes.func.isRequired,
    onAddOption: PropTypes.func.isRequired,
    onRemoveOption: PropTypes.func.isRequired,
    onChangeSettings: PropTypes.func.isRequired,
    suggestions: ImmutablePropTypes.list,
    onClearSuggestions: PropTypes.func.isRequired,
    onFetchSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    maxOptions: PropTypes.number.isRequired,
    maxOptionChars: PropTypes.number.isRequired,
    maxExpiration: PropTypes.number,
    minExpiration: PropTypes.number,
  };

  handleAddOption = () => {
    this.props.onAddOption('');
  };

  handleSelectDuration = e => {
    this.props.onChangeSettings(e.target.value, this.props.isMultiple);
  };

  handleToggleMultiple = () => {
    this.props.onChangeSettings(this.props.expiresIn, !this.props.isMultiple);
  };

  render() {
    const { options, expiresIn, isMultiple, onChangeOption, onRemoveOption, maxOptions, maxOptionChars, intl, ...other } = this.props;

    if (!options) {
      return null;
    }

    return (
      <div className='compose-form__poll-wrapper'>
        <ul>
          {options.map((title, i) => (
            <Option
              title={title}
              key={i}
              index={i}
              onChange={onChangeOption}
              onRemove={onRemoveOption}
              isPollMultiple={isMultiple}
              onToggleMultiple={this.handleToggleMultiple}
              maxChars={maxOptionChars}
              numOptions={options.size}
              {...other}
            />
          ))}
        </ul>

        <div className='poll__footer'>
          {options.size < maxOptions && (
            <button className='button button-secondary' onClick={this.handleAddOption}><Icon src={require('@tabler/icons/icons/plus.svg')} /> <FormattedMessage {...messages.add_option} /></button>
          )}

          <select value={expiresIn} onChange={this.handleSelectDuration}>
            <option value={300}>{intl.formatMessage(messages.minutes, { number: 5 })}</option>
            <option value={1800}>{intl.formatMessage(messages.minutes, { number: 30 })}</option>
            <option value={3600}>{intl.formatMessage(messages.hours, { number: 1 })}</option>
            <option value={21600}>{intl.formatMessage(messages.hours, { number: 6 })}</option>
            <option value={86400}>{intl.formatMessage(messages.days, { number: 1 })}</option>
            <option value={259200}>{intl.formatMessage(messages.days, { number: 3 })}</option>
            <option value={604800}>{intl.formatMessage(messages.days, { number: 7 })}</option>
          </select>
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => {
  const pollLimits = state.getIn(['instance', 'configuration', 'polls']);

  return {
    maxOptions: pollLimits.get('max_options'),
    maxOptionChars: pollLimits.get('max_characters_per_option'),
    maxExpiration: pollLimits.get('max_expiration'),
    minExpiration: pollLimits.get('min_expiration'),
  };
};

export default injectIntl(connect(mapStateToProps)(PollForm));
