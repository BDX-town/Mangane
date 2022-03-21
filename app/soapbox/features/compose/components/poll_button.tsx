import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import ComposeFormButton from './compose_form_button';

const messages = defineMessages({
  add_poll: { id: 'poll_button.add_poll', defaultMessage: 'Add a poll' },
  remove_poll: { id: 'poll_button.remove_poll', defaultMessage: 'Remove poll' },
});

interface IPollButton {
  disabled?: boolean,
  unavailable?: boolean,
  active?: boolean,
  onClick: () => void,
}

const PollButton: React.FC<IPollButton> = ({ active, unavailable, disabled, onClick }) => {
  const intl = useIntl();

  if (unavailable) {
    return null;
  }

  return (
    <ComposeFormButton
      icon={require('@tabler/icons/icons/chart-bar.svg')}
      title={intl.formatMessage(active ? messages.remove_poll : messages.add_poll)}
      active={active}
      disabled={disabled}
      onClick={onClick}
    />
  );
};

export default PollButton;
