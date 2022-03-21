import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import ComposeFormButton from './compose_form_button';

const messages = defineMessages({
  marked: { id: 'compose_form.markdown.marked', defaultMessage: 'Post markdown enabled' },
  unmarked: { id: 'compose_form.markdown.unmarked', defaultMessage: 'Post markdown disabled' },
});

interface IMarkdownButton {
  active?: boolean,
  onClick: () => void,
}

const MarkdownButton: React.FC<IMarkdownButton> = ({ active, onClick }) => {
  const intl = useIntl();

  return (
    <ComposeFormButton
      icon={require('@tabler/icons/icons/markdown.svg')}
      title={intl.formatMessage(active ? messages.marked : messages.unmarked)}
      active={active}
      onClick={onClick}
    />
  );

};

export default MarkdownButton;
