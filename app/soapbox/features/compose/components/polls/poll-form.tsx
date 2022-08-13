import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { addPollOption, changePollOption, changePollSettings, clearComposeSuggestions, fetchComposeSuggestions, removePoll, removePollOption, selectComposeSuggestion } from 'soapbox/actions/compose';
import AutosuggestInput from 'soapbox/components/autosuggest_input';
import { Button, Divider, HStack, Stack, Text, Toggle } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import DurationSelector from './duration-selector';

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
  onRemove(index: number): void
  onRemovePoll(): void
  title: string
}

const Option = (props: IOption) => {
  const {
    index,
    maxChars,
    numOptions,
    onChange,
    onRemove,
    onRemovePoll,
    title,
  } = props;

  const dispatch = useAppDispatch();
  const intl = useIntl();

  const suggestions = useAppSelector((state) => state.compose.suggestions);

  const handleOptionTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(index, event.target.value);

  const handleOptionRemove = () => {
    if (numOptions > 2) {
      onRemove(index);
    } else {
      onRemovePoll();
    }
  };

  const onSuggestionsClearRequested = () => dispatch(clearComposeSuggestions());

  const onSuggestionsFetchRequested = (token: string) => dispatch(fetchComposeSuggestions(token));

  const onSuggestionSelected = (tokenStart: number, token: string | null, value: AutoSuggestion) => {
    if (token && typeof token === 'string') {
      dispatch(selectComposeSuggestion(tokenStart, token, value, ['poll', 'options', index]));
    }
  };

  return (
    <HStack alignItems='center' justifyContent='between' space={4}>
      <HStack alignItems='center' space={2} grow>
        <div className='w-6'>
          <Text weight='bold'>{index + 1}.</Text>
        </div>

        <AutosuggestInput
          className='rounded-md dark:!bg-transparent !bg-transparent'
          placeholder={intl.formatMessage(messages.option_placeholder, { number: index + 1 })}
          maxLength={maxChars}
          value={title}
          onChange={handleOptionTitleChange}
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          searchTokens={[':']}
          autoFocus={index === 0 || index >= 2}
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

const PollForm = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const pollLimits = useAppSelector((state) => state.instance.getIn(['configuration', 'polls']) as any);
  const options = useAppSelector((state) => state.compose.poll?.options);
  const expiresIn = useAppSelector((state) => state.compose.poll?.expires_in);
  const isMultiple = useAppSelector((state) => state.compose.poll?.multiple);

  const maxOptions = pollLimits.get('max_options');
  const maxOptionChars = pollLimits.get('max_characters_per_option');

  const onRemoveOption = (index: number) => dispatch(removePollOption(index));
  const onChangeOption = (index: number, title: string) => dispatch(changePollOption(index, title));
  const handleAddOption = () => dispatch(addPollOption(''));
  const onChangeSettings = (expiresIn: string | number | undefined, isMultiple?: boolean) =>
    dispatch(changePollSettings(expiresIn, isMultiple));
  const handleSelectDuration = (value: number) => onChangeSettings(value, isMultiple);
  const handleToggleMultiple = () => onChangeSettings(expiresIn, !isMultiple);
  const onRemovePoll = () => dispatch(removePoll());

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
            onRemovePoll={onRemovePoll}
          />
        ))}

        <HStack space={2}>
          <div className='w-6' />

          {options.size < maxOptions && (
            <Button
              theme='secondary'
              onClick={handleAddOption}
              size='sm'
              block
            >
              <FormattedMessage {...messages.add_option} />
            </Button>
          )}
        </HStack>
      </Stack>

      <Divider />

      <button onClick={handleToggleMultiple} className='text-left'>
        <HStack alignItems='center' justifyContent='between'>
          <Stack>
            <Text weight='medium'>
              {intl.formatMessage(messages.multiSelect)}
            </Text>

            <Text theme='muted' size='sm'>
              {intl.formatMessage(messages.multiSelectDetail)}
            </Text>
          </Stack>

          <Toggle checked={isMultiple} onChange={handleToggleMultiple} />
        </HStack>
      </button>

      <Divider />

      {/* Duration */}
      <Stack space={2}>
        <Text weight='medium'>
          {intl.formatMessage(messages.pollDuration)}
        </Text>

        <DurationSelector onDurationChange={handleSelectDuration} />
      </Stack>

      {/* Remove Poll */}
      <div className='text-center'>
        <button className='text-danger-500' onClick={onRemovePoll}>
          {intl.formatMessage(messages.removePoll)}
        </button>
      </div>
    </Stack>
  );
};

export default PollForm;
