import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import ComposeFormButton from './compose_form_button';

const messages = defineMessages({
  marked: { id: 'compose_form.spoiler.marked', defaultMessage: 'Text is hidden behind warning' },
  unmarked: { id: 'compose_form.spoiler.unmarked', defaultMessage: 'Text is not hidden' },
});

interface ISpoilerButton {
  active?: boolean,
  onClick: () => void,
}

const SpoilerButton: React.FC<ISpoilerButton> = ({ active, onClick }) => {
  const intl = useIntl();

  return (
    <ComposeFormButton
      icon={require('@tabler/icons/icons/alert-triangle.svg')}
      title={intl.formatMessage(active ? messages.marked : messages.unmarked)}
      active={active}
      onClick={onClick}
    />
  );
};

export default SpoilerButton;
