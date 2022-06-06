'use strict';

import classNames from 'classnames';
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import AutosuggestInput from 'soapbox/components/autosuggest_input';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';
import { HStack } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

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

interface IOption {
  index: number
  isPollMultiple?: boolean
  maxChars: number
  numOptions: number
  onChange(index: number, value: string): void
  onClearSuggestions(): void
  onFetchSuggestions(token: string): void
  onRemove(index: number): void
  onRemovePoll(): void
  onSuggestionSelected(tokenStart: number, token: string, value: string, key: (string | number)[]): void
  onToggleMultiple(): void
  suggestions?: any // list
  title: string
}

const Option = (props: IOption) => {
  const {
    index,
    isPollMultiple,
    maxChars,
    numOptions,
    onChange,
    onClearSuggestions,
    onFetchSuggestions,
    onRemove,
    onRemovePoll,
    onToggleMultiple,
    suggestions,
    title,
  } = props;

  const intl = useIntl();

  const handleOptionTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(index, event.target.value);

  const handleOptionRemove = () => {
    if (numOptions > 2) {
      onRemove(index);
    } else {
      onRemovePoll();
    }
  };

  const handleToggleMultiple = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onToggleMultiple();
  };

  const onSuggestionsClearRequested = () => onClearSuggestions();

  const handleCheckboxKeypress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleToggleMultiple(event);
    }
  };

  const onSuggestionsFetchRequested = (token: string) => onFetchSuggestions(token);

  const onSuggestionSelected = (tokenStart: number, token: string, value: string) =>
    props.onSuggestionSelected(tokenStart, token, value, ['poll', 'options', index]);

  return (
    <li>
      <label className='poll__text editable'>
        <span
          className={classNames('poll__input', { checkbox: isPollMultiple })}
          onClick={handleToggleMultiple}
          onKeyPress={handleCheckboxKeypress}
          role='button'
          tabIndex={0}
          title={intl.formatMessage(isPollMultiple ? messages.switchToSingle : messages.switchToMultiple)}
          aria-label={intl.formatMessage(isPollMultiple ? messages.switchToSingle : messages.switchToMultiple)}
        />

        <AutosuggestInput
          placeholder={intl.formatMessage(messages.option_placeholder, { number: index + 1 })}
          maxLength={maxChars}
          value={title}
          onChange={handleOptionTitleChange}
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          searchTokens={[':']}
          autoFocus
        />
      </label>

      <div className='poll__cancel'>
        <IconButton
          title={intl.formatMessage(messages.remove_option)}
          src={require('@tabler/icons/icons/x.svg')}
          onClick={handleOptionRemove}
        />
      </div>
    </li>
  );
};

interface IPollForm {
  expiresIn?: number
  isMultiple?: boolean
  onAddOption(value: string): void
  onChangeOption(): void
  onChangeSettings(value: string | number | undefined, isMultiple?: boolean): void
  onClearSuggestions(): void
  onFetchSuggestions(token: string): void
  onRemoveOption(): void
  onRemovePoll(): void
  onSuggestionSelected(tokenStart: number, token: string, value: string, key: (string | number)[]): void
  options?: any
  suggestions?: any // list
}

const PollForm = (props: IPollForm) => {
  const {
    expiresIn,
    isMultiple,
    onAddOption,
    onChangeOption,
    onChangeSettings,
    onRemoveOption,
    options,
    ...filteredProps
  } = props;

  const intl = useIntl();

  const pollLimits = useAppSelector((state) => state.instance.getIn(['configuration', 'polls']) as any);
  const maxOptions = pollLimits.get('max_options');
  const maxOptionChars = pollLimits.get('max_characters_per_option');

  const handleAddOption = () => onAddOption('');

  const handleSelectDuration = (event: React.ChangeEvent<HTMLSelectElement>) =>
    onChangeSettings(event.target.value, isMultiple);

  const handleToggleMultiple = () => onChangeSettings(expiresIn, !isMultiple);


  if (!options) {
    return null;
  }

  return (
    <div className='compose-form__poll-wrapper'>
      <ul>
        {options.map((title: string, i: number) => (
          <Option
            title={title}
            key={i}
            index={i}
            onChange={onChangeOption}
            onRemove={onRemoveOption}
            isPollMultiple={isMultiple}
            onToggleMultiple={handleToggleMultiple}
            maxChars={maxOptionChars}
            numOptions={options.size}
            {...filteredProps}
          />
        ))}
      </ul>

      <HStack className='text-black dark:text-white' space={2}>
        {options.size < maxOptions && (
          <button className='button button-secondary' onClick={handleAddOption}>
            <Icon src={require('@tabler/icons/icons/plus.svg')} />
            <FormattedMessage {...messages.add_option} />
          </button>
        )}

        <select value={expiresIn} onChange={handleSelectDuration}>
          <option value={300}>{intl.formatMessage(messages.minutes, { number: 5 })}</option>
          <option value={1800}>{intl.formatMessage(messages.minutes, { number: 30 })}</option>
          <option value={3600}>{intl.formatMessage(messages.hours, { number: 1 })}</option>
          <option value={21600}>{intl.formatMessage(messages.hours, { number: 6 })}</option>
          <option value={86400}>{intl.formatMessage(messages.days, { number: 1 })}</option>
          <option value={259200}>{intl.formatMessage(messages.days, { number: 3 })}</option>
          <option value={604800}>{intl.formatMessage(messages.days, { number: 7 })}</option>
        </select>
      </HStack>
    </div>
  );
};

export default PollForm;
