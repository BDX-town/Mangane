'use strict';

import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import AutosuggestInput from 'soapbox/components/autosuggest_input';
import { Button, Divider, HStack, Stack, Text, Toggle } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import DurationSelector from './polls/duration-selector';

import type { AutoSuggestion } from 'soapbox/components/autosuggest_input';

const messages = defineMessages({
  option_placeholder: { id: 'compose_form.poll.option_placeholder', defaultMessage: 'Answer #{number}' },
  add_option: { id: 'compose_form.poll.add_option', defaultMessage: 'Add an answer' },
  remove_option: { id: 'compose_form.poll.remove_option', defaultMessage: 'Remove this answer' },
  pollDuration: { id: 'compose_form.poll.duration', defaultMessage: 'Duration' },
  removePoll: { id: 'compose_form.poll.remove', defaultMessage: 'Remove poll' },
  switchToMultiple: { id: 'compose_form.poll.switch_to_multiple', defaultMessage: 'Change poll to allow multiple answers' },
  switchToSingle: { id: 'compose_form.poll.switch_to_single', defaultMessage: 'Change poll to allow for a single answer' },
  minutes: { id: 'intervals.full.minutes', defaultMessage: '{number, plural, one {# minute} other {# minutes}}' },
  hours: { id: 'intervals.full.hours', defaultMessage: '{number, plural, one {# hour} other {# hours}}' },
  days: { id: 'intervals.full.days', defaultMessage: '{number, plural, one {# day} other {# days}}' },
  multiSelect: { id: 'compose_form.poll.multiselect', defaultMessage: 'Multi-Select' },
  multiSelectDetail: { id: 'compose_form.poll.multiselect_detail', defaultMessage: 'Allow users to select multiple answers' },
});

interface IOption {
  index: number
  maxChars: number
  numOptions: number
  onChange(index: number, value: string): void
  onClearSuggestions(): void
  onFetchSuggestions(token: string): void
  onRemove(index: number): void
  onRemovePoll(): void
  onSuggestionSelected(tokenStart: number, token: string, value: string, key: (string | number)[]): void
  suggestions?: any // list
  title: string
}

const Option = (props: IOption) => {
  const {
    index,
    maxChars,
    numOptions,
    onChange,
    onClearSuggestions,
    onFetchSuggestions,
    onRemove,
    onRemovePoll,
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

  const onSuggestionsClearRequested = () => onClearSuggestions();

  const onSuggestionsFetchRequested = (token: string) => onFetchSuggestions(token);

  const onSuggestionSelected = (tokenStart: number, token: string | null, value: AutoSuggestion) => {
    if (token && typeof value === 'string') {
      props.onSuggestionSelected(tokenStart, token, value, ['poll', 'options', index]);
    }
  };

  return (
    <HStack alignItems='center' justifyContent='between' space={4}>
      <HStack alignItems='center' space={2} grow>
        <div className='w-6'>
          <Text weight='bold'>{index + 1}.</Text>
        </div>

        <AutosuggestInput
          className='rounded-md'
          placeholder={intl.formatMessage(messages.option_placeholder, { number: index + 1 })}
          maxLength={maxChars}
          value={title}
          onChange={handleOptionTitleChange}
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          searchTokens={[':']}
          autoFocus={index === 0}
        />
      </HStack>

      {index > 1 && (
        <div>
          <Button theme='danger' size='sm' onClick={handleOptionRemove}>Delete</Button>
        </div>
      )}
    </HStack>
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
  const handleSelectDuration = (value: number) => onChangeSettings(value, isMultiple);
  const handleToggleMultiple = () => onChangeSettings(expiresIn, !isMultiple);

  if (!options) {
    return null;
  }

  return (
    <Stack space={4}>
      <Stack space={2}>
        {options.map((title: string, i: number) => (
          <Option
            title={title}
            key={i}
            index={i}
            onChange={onChangeOption}
            onRemove={onRemoveOption}
            maxChars={maxOptionChars}
            numOptions={options.size}
            {...filteredProps}
          />
        ))}

        <HStack space={2}>
          <div className='w-6' />

          {options.size < maxOptions && (
            <Button
              theme='secondary'
              icon={require('@tabler/icons/icons/plus.svg')}
              onClick={handleAddOption}
              size='sm'
            >
              <FormattedMessage {...messages.add_option} />
            </Button>
          )}
        </HStack>
      </Stack>

      <Divider />

      <HStack alignItems='center' justifyContent='between'>
        <Stack>
          <Text size='lg' weight='medium'>
            {intl.formatMessage(messages.multiSelect)}
          </Text>

          <Text theme='muted'>
            {intl.formatMessage(messages.multiSelectDetail)}
          </Text>
        </Stack>

        <Toggle checked={isMultiple} onChange={handleToggleMultiple} />
      </HStack>

      <Divider />

      {/* Duration */}
      <Stack space={2}>
        <Text size='lg' weight='medium'>
          {intl.formatMessage(messages.pollDuration)}
        </Text>

        <DurationSelector onDurationChange={handleSelectDuration} />
      </Stack>

      {/* Remove Poll */}
      <div className='text-center'>
        <Button theme='danger' onClick={props.onRemovePoll}>
          {intl.formatMessage(messages.removePoll)}
        </Button>
      </div>
    </Stack>
  );
};

export default PollForm;
