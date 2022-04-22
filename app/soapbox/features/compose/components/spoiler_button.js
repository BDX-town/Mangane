import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import IconButton from '../../../components/icon_button';

const messages = defineMessages({
  marked: { id: 'compose_form.spoiler.marked', defaultMessage: 'Text is hidden behind warning' },
  unmarked: { id: 'compose_form.spoiler.unmarked', defaultMessage: 'Text is not hidden' },
});

export default @injectIntl
class SpoilerButton extends React.PureComponent {

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
      <div className='compose-form__spoiler-button'>
        <IconButton
          className={classNames('compose-form__spoiler-button-icon', { active })}
          src={require('@tabler/icons/icons/alert-triangle.svg')}
          title={intl.formatMessage(active ? messages.marked : messages.unmarked)}
          onClick={this.handleClick}
        />
      </div>
    );
  }

}
