import React, { useEffect, useMemo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Select } from 'soapbox/components/ui';

const messages = defineMessages({
  minutes: { id: 'intervals.full.minutes', defaultMessage: '{number, plural, one {# minute} other {# minutes}}' },
  hours: { id: 'intervals.full.hours', defaultMessage: '{number, plural, one {# hour} other {# hours}}' },
  days: { id: 'intervals.full.days', defaultMessage: '{number, plural, one {# day} other {# days}}' },
});

interface IDurationSelector {
  onDurationChange(expiresIn: number): void
}

const DurationSelector = ({ onDurationChange }: IDurationSelector) => {
  const intl = useIntl();

  const [days, setDays] = useState<number>(2);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  const value = useMemo(() => {
    const now: any = new Date();
    const future: any = new Date();
    now.setDate(now.getDate() + days);
    now.setMinutes(now.getMinutes() + minutes);
    now.setHours(now.getHours() + hours);

    return Math.round((now - future) / 1000);
  }, [days, hours, minutes]);

  useEffect(() => {
    if (days === 7) {
      setHours(0);
      setMinutes(0);
    }
  }, [days]);

  useEffect(() => {
    onDurationChange(value);
  }, [value]);

  return (
    <div className='grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-3'>
      <div className='sm:col-span-1'>
        <Select
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
          data-testid='duration-selector-days'
        >
          {[...Array(8).fill(undefined)].map((_, number) => (
            <option value={number} key={number}>
              {intl.formatMessage(messages.days, { number })}
            </option>
          ))}
        </Select>
      </div>

      <div className='sm:col-span-1'>
        <Select
          value={hours}
          onChange={(event) => setHours(Number(event.target.value))}
          disabled={days === 7}
          data-testid='duration-selector-hours'
        >
          {[...Array(24).fill(undefined)].map((_, number) => (
            <option value={number} key={number}>
              {intl.formatMessage(messages.hours, { number })}
            </option>
          ))}
        </Select>
      </div>

      <div className='sm:col-span-1'>
        <Select
          value={minutes}
          onChange={(event) => setMinutes(Number(event.target.value))}
          disabled={days === 7}
          data-testid='duration-selector-minutes'
        >
          {[0, 15, 30, 45].map((number) => (
            <option value={number} key={number}>
              {intl.formatMessage(messages.minutes, { number })}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default DurationSelector;
