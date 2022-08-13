import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import IconButton from 'soapbox/components/icon_button';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { DatePicker } from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useFeatures } from 'soapbox/hooks';

const messages = defineMessages({
  birthdayPlaceholder: { id: 'edit_profile.fields.birthday_placeholder', defaultMessage: 'Your birthday' },
  previousMonth: { id: 'datepicker.previous_month', defaultMessage: 'Previous month' },
  nextMonth: { id: 'datepicker.next_month', defaultMessage: 'Next month' },
  previousYear: { id: 'datepicker.previous_year', defaultMessage: 'Previous year' },
  nextYear: { id: 'datepicker.next_year', defaultMessage: 'Next year' },
});

interface IBirthdayInput {
  value?: string,
  onChange: (value: string) => void,
  required?: boolean,
}

const BirthdayInput: React.FC<IBirthdayInput> = ({ value, onChange, required }) => {
  const intl = useIntl();
  const features = useFeatures();

  const supportsBirthdays = features.birthdays;
  const minAge = useAppSelector((state) => state.instance.pleroma.getIn(['metadata', 'birthday_min_age'])) as number;

  const maxDate = useMemo(() => {
    if (!supportsBirthdays) return null;

    let maxDate = new Date();
    maxDate = new Date(maxDate.getTime() - minAge * 1000 * 60 * 60 * 24 + maxDate.getTimezoneOffset() * 1000 * 60);
    return maxDate;
  }, [minAge]);

  const selected = useMemo(() => {
    if (!supportsBirthdays || !value) return null;

    const date = new Date(value);
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  }, [value]);

  if (!supportsBirthdays) return null;

  const renderCustomHeader = ({
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    decreaseYear,
    increaseYear,
    prevYearButtonDisabled,
    nextYearButtonDisabled,
    date,
  }: {
    decreaseMonth(): void,
    increaseMonth(): void,
    prevMonthButtonDisabled: boolean,
    nextMonthButtonDisabled: boolean,
    decreaseYear(): void,
    increaseYear(): void,
    prevYearButtonDisabled: boolean,
    nextYearButtonDisabled: boolean,
    date: Date,
  }) => {
    return (
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <IconButton
            className='datepicker__button'
            src={require('@tabler/icons/chevron-left.svg')}
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            aria-label={intl.formatMessage(messages.previousMonth)}
            title={intl.formatMessage(messages.previousMonth)}
          />
          {intl.formatDate(date, { month: 'long' })}
          <IconButton
            className='datepicker__button'
            src={require('@tabler/icons/chevron-right.svg')}
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            aria-label={intl.formatMessage(messages.nextMonth)}
            title={intl.formatMessage(messages.nextMonth)}
          />
        </div>
        <div className='flex items-center justify-between'>
          <IconButton
            className='datepicker__button'
            src={require('@tabler/icons/chevron-left.svg')}
            onClick={decreaseYear}
            disabled={prevYearButtonDisabled}
            aria-label={intl.formatMessage(messages.previousYear)}
            title={intl.formatMessage(messages.previousYear)}
          />
          {intl.formatDate(date, { year: 'numeric' })}
          <IconButton
            className='datepicker__button'
            src={require('@tabler/icons/chevron-right.svg')}
            onClick={increaseYear}
            disabled={nextYearButtonDisabled}
            aria-label={intl.formatMessage(messages.nextYear)}
            title={intl.formatMessage(messages.nextYear)}
          />
        </div>
      </div>
    );
  };

  const handleChange = (date: Date) => onChange(date ? new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10) : '');

  return (
    <div className='mt-1 relative rounded-md shadow-sm'>
      <BundleContainer fetchComponent={DatePicker}>
        {Component => (<Component
          selected={selected}
          wrapperClassName='react-datepicker-wrapper'
          onChange={handleChange}
          placeholderText={intl.formatMessage(messages.birthdayPlaceholder)}
          minDate={new Date('1900-01-01')}
          maxDate={maxDate}
          required={required}
          renderCustomHeader={renderCustomHeader}
          isClearable={!required}
        />)}
      </BundleContainer>
    </div>
  );
};

export default BirthdayInput;
