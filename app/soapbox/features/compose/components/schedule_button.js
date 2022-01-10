import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import IconButton from '../../../components/icon_button';

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
    onClick: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleClick = () => {
    this.props.onClick();
  }

  render() {
    const { intl, active, disabled } = this.props;

    return (
      <div className='compose-form__schedule-button'>
        <IconButton
          className={classNames('compose-form__schedule-button-icon', { active })}
          src={require('@tabler/icons/icons/calendar-stats.svg')}
          title={intl.formatMessage(active ? messages.remove_schedule : messages.add_schedule)}
          disabled={disabled}
          onClick={this.handleClick}
        />
      </div>
    );
  }

}
