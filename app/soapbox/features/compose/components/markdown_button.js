import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import IconButton from '../../../components/icon_button';

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
    unavailable: PropTypes.bool,
  };

  handleClick = () => {
    this.props.onClick();
  }

  render() {
    const { intl, active, unavailable } = this.props;

    if (unavailable) {
      return null;
    }

    return (
      <div className='compose-form__markdown-button'>
        <IconButton
          className={classNames('compose-form__markdown-button-icon', { active })}
          src={require('@tabler/icons/icons/markdown.svg')}
          title={intl.formatMessage(active ? messages.marked : messages.unmarked)}
          onClick={this.handleClick}
        />
      </div>
    );
  }

}
