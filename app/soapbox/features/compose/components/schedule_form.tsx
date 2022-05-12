'use strict';

import classNames from 'classnames';
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { setSchedule, removeSchedule } from 'soapbox/actions/compose';
import IconButton from 'soapbox/components/icon_button';
import { HStack, Stack, Text } from 'soapbox/components/ui';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { DatePicker } from 'soapbox/features/ui/util/async-components';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

const isCurrentOrFutureDate = (date: Date) => {
  return date && new Date().setHours(0, 0, 0, 0) <= new Date(date).setHours(0, 0, 0, 0);
};

const isFiveMinutesFromNow = (time: Date) => {
  const fiveMinutesFromNow = new Date(new Date().getTime() + 300000); // now, plus five minutes (Pleroma won't schedule posts )
  const selectedDate = new Date(time);

  return fiveMinutesFromNow.getTime() < selectedDate.getTime();
};

const messages = defineMessages({
  schedule: { id: 'schedule.post_time', defaultMessage: 'Post Date/Time' },
  remove: { id: 'schedule.remove', defaultMessage: 'Remove schedule' },
});

const ScheduleForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const scheduledAt = useAppSelector((state) => state.compose.get('schedule'));
  const active = !!scheduledAt;

  const onSchedule = (date: Date) => {
    dispatch(setSchedule(date));
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(removeSchedule());
    e.preventDefault();
  };

  if (!active) {
    return null;
  }

  return (
    <Stack className='mb-2' space={1}>
      <Text theme='muted'>
        <FormattedMessage id='datepicker.hint' defaultMessage='Scheduled to post at…' />
      </Text>
      <HStack space={2} alignItems='center'>
        <BundleContainer fetchComponent={DatePicker}>
          {Component => (<Component
            selected={scheduledAt}
            showTimeSelect
            dateFormat='MMMM d, yyyy h:mm aa'
            timeIntervals={15}
            wrapperClassName='react-datepicker-wrapper'
            onChange={onSchedule}
            placeholderText={intl.formatMessage(messages.schedule)}
            filterDate={isCurrentOrFutureDate}
            filterTime={isFiveMinutesFromNow}
            className={classNames({
              'has-error': !isFiveMinutesFromNow(scheduledAt),
            })}
          />)}
        </BundleContainer>
        <IconButton
          iconClassName='w-4 h-4'
          className='bg-transparent text-gray-400 hover:text-gray-600'
          src={require('@tabler/icons/icons/x.svg')}
          onClick={handleRemove}
          title={intl.formatMessage(messages.remove)}
        />
      </HStack>
    </Stack>
  );
};

export default ScheduleForm;
