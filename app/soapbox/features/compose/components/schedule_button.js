import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import ComposeFormButton from './compose_form_button';

const messages = defineMessages({
  add_schedule: { id: 'schedule_button.add_schedule', defaultMessage: 'Schedule post for later' },
  remove_schedule: { id: 'schedule_button.remove_schedule', defaultMessage: 'Post immediately' },
});

export default
@injectIntl
class ScheduleButton extends React.PureComponent {

  static propTypes = {
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    unavailable: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleClick = () => {
    this.props.onClick();
  }

  render() {
    const { intl, active, unavailable, disabled } = this.props;

    if (unavailable) {
      return null;
    }

    return (
      <ComposeFormButton
        icon={require('@tabler/icons/icons/calendar-stats.svg')}
        title={intl.formatMessage(active ? messages.remove_schedule : messages.add_schedule)}
        active={active}
        disabled={disabled}
        onClick={this.handleClick}
      />
    );
  }

}
