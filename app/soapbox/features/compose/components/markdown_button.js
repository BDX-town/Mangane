import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import ComposeFormButton from './compose_form_button';

const messages = defineMessages({
  marked: { id: 'compose_form.markdown.marked', defaultMessage: 'Post markdown enabled' },
  unmarked: { id: 'compose_form.markdown.unmarked', defaultMessage: 'Post markdown disabled' },
});

export default @injectIntl
class MarkdownButton extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleClick = () => {
    this.props.onClick();
  }

  render() {
    const { intl, active } = this.props;

    return (
      <ComposeFormButton
        icon={require('@tabler/icons/icons/markdown.svg')}
        title={intl.formatMessage(active ? messages.marked : messages.unmarked)}
        active={active}
        onClick={this.handleClick}
      />
    );
  }

}
