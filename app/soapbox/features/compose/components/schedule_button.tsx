import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import ComposeFormButton from './compose_form_button';

const messages = defineMessages({
  add_schedule: { id: 'schedule_button.add_schedule', defaultMessage: 'Schedule post for later' },
  remove_schedule: { id: 'schedule_button.remove_schedule', defaultMessage: 'Post immediately' },
});

interface IScheduleButton {
  disabled: boolean,
  active: boolean,
  unavailable: boolean,
  onClick: () => void,
}

const ScheduleButton: React.FC<IScheduleButton> = ({ active, unavailable, disabled, onClick }) => {
  const intl = useIntl();

  const handleClick = () => {
    onClick();
  };

  if (unavailable) {
    return null;
  }

  return (
    <ComposeFormButton
      icon={require('@tabler/icons/calendar-stats.svg')}
      title={intl.formatMessage(active ? messages.remove_schedule : messages.add_schedule)}
      active={active}
      disabled={disabled}
      onClick={handleClick}
    />
  );
};

export default ScheduleButton;
