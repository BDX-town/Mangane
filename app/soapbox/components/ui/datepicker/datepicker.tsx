import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Select from '../select/select';
import Stack from '../stack/stack';
import Text from '../text/text';

const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
const currentYear = new Date().getFullYear();

interface IDatepicker {
  onChange(date: Date): void
}

/**
 * Datepicker that allows a user to select month, day, and year.
 */
const Datepicker = ({ onChange }: IDatepicker) => {
  const intl = useIntl();

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [day, setDay] = useState<number>(new Date().getDate());
  const [year, setYear] = useState<number>(2022);

  const numberOfDays = useMemo(() => {
    return getDaysInMonth(month, year);
  }, [month, year]);

  useEffect(() => {
    onChange(new Date(year, month, day));
  }, [month, day, year]);

  return (
    <div className='grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-3'>
      <div className='sm:col-span-1'>
        <Stack>
          <Text size='sm' weight='medium' theme='muted'>
            <FormattedMessage id='datepicker.month' defaultMessage='Month' />
          </Text>

          <Select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            data-testid='datepicker-month'
          >
            {[...Array(12)].map((_, idx) => (
              <option key={idx} value={idx}>
                {intl.formatDate(new Date(year, idx, 1), { month: 'long' })}
              </option>
            ))}
          </Select>
        </Stack>
      </div>

      <div className='sm:col-span-1'>
        <Stack>
          <Text size='sm' weight='medium' theme='muted'>
            <FormattedMessage id='datepicker.day' defaultMessage='Day' />
          </Text>

          <Select
            value={day}
            onChange={(event) => setDay(Number(event.target.value))}
            data-testid='datepicker-day'
          >
            {[...Array(numberOfDays)].map((_, idx) => (
              <option key={idx} value={idx + 1}>{idx + 1}</option>
            ))}
          </Select>
        </Stack>
      </div>

      <div className='sm:col-span-1'>
        <Stack>
          <Text size='sm' weight='medium' theme='muted'>
            <FormattedMessage id='datepicker.year' defaultMessage='Year' />
          </Text>

          <Select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            data-testid='datepicker-year'
          >
            {[...Array(121)].map((_, idx) => (
              <option key={idx} value={currentYear - idx}>{currentYear - idx}</option>
            ))}
          </Select>
        </Stack>
      </div>
    </div>
  );
};

export default Datepicker;
