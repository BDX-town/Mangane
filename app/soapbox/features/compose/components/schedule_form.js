'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const messages = defineMessages({
  schedule: { id: 'schedule.post_time', defaultMessage: 'Post Date/Time' },
});

class ScheduleForm extends React.Component {

  static propTypes = {
    schedule: PropTypes.instanceOf(Date),
    intl: PropTypes.object.isRequired,
    onSchedule: PropTypes.func.isRequired,
    active: PropTypes.bool,
  };

  setSchedule(date)
  {
    this.setState({ schedule: date });
    this.props.onSchedule(date);
  }

  openDatePicker(datePicker)
  {
    if (!datePicker)
    {
      return;
    }

    datePicker.setOpen(true);
  }

  componentDidMount()
  {
    this.setState({ schedule: this.props.schedule });
  }

  constructor(props)
  {
    super(props);

    this.setSchedule = this.setSchedule.bind(this);
  }

  isCurrentOrFutureDate(date)
  {
    return date && new Date().setHours(0, 0, 0, 0) <= new Date(date).setHours(0, 0, 0, 0);
  }

  isFiveMinutesFromNow(time)
  {
    const fiveMinutesFromNow = new Date(new Date().getTime() + 300000); // now, plus five minutes (Pleroma won't schedule posts )
    const selectedDate = new Date(time);

    return fiveMinutesFromNow.getTime() < selectedDate.getTime();
  };

  render() {
    if (!this.props.active || !this.state)
    {
      return null;
    }

    const { schedule } = this.state;

    return (
      <DatePicker
        selected={schedule}
        showTimeSelect
        dateFormat='MMMM d, yyyy h:mm aa'
        timeIntervals={15}
        wrapperClassName='react-datepicker-wrapper'
        onChange={this.setSchedule}
        placeholderText={this.props.intl.formatMessage(messages.schedule)}
        filterDate={this.isCurrentOrFutureDate}
        filterTime={this.isFiveMinutesFromNow}
        ref={this.isCurrentOrFutureDate(schedule) ? null : this.openDatePicker}
      />
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  schedule: state.getIn(['compose', 'schedule']),
});

export default injectIntl(connect(mapStateToProps)(ScheduleForm));
