'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { setSchedule, removeSchedule } from '../../../actions/compose';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import IconButton from 'soapbox/components/icon_button';
import classNames from 'classnames';

const messages = defineMessages({
  schedule: { id: 'schedule.post_time', defaultMessage: 'Post Date/Time' },
  remove: { id: 'schedule.remove', defaultMessage: 'Remove schedule' },
});

const mapStateToProps = state => ({
  active: state.getIn(['compose', 'schedule']) ? true : false,
  scheduledAt: state.getIn(['compose', 'schedule']),
});

const mapDispatchToProps = dispatch => ({
  onSchedule(date) {
    dispatch(setSchedule(date));
  },

  onRemoveSchedule(date) {
    dispatch(removeSchedule());
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ScheduleForm extends React.Component {

  static propTypes = {
    scheduledAt: PropTypes.instanceOf(Date),
    intl: PropTypes.object.isRequired,
    onSchedule: PropTypes.func.isRequired,
    onRemoveSchedule: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
    active: PropTypes.bool,
  };

  state = {
    initialized: false,
  }

  setSchedule = date => {
    this.props.onSchedule(date);
  }

  setRef = c => {
    this.datePicker = c;
  }

  openDatePicker = () => {
    if (!this.datePicker) return;
    this.datePicker.setOpen(true);
  }

  isCurrentOrFutureDate(date) {
    return date && new Date().setHours(0, 0, 0, 0) <= new Date(date).setHours(0, 0, 0, 0);
  }

  isFiveMinutesFromNow(time) {
    const fiveMinutesFromNow = new Date(new Date().getTime() + 300000); // now, plus five minutes (Pleroma won't schedule posts )
    const selectedDate = new Date(time);

    return fiveMinutesFromNow.getTime() < selectedDate.getTime();
  }

  handleRemove = e => {
    this.props.onRemoveSchedule();
    e.preventDefault();
  }

  initialize = () => {
    const { initialized } = this.state;

    if (!initialized && this.datePicker) {
      this.openDatePicker();
      this.setState({ initialized: true });
    }
  }

  componentDidUpdate() {
    this.initialize();
  }

  render() {
    if (!this.props.active) {
      return null;
    }

    const { intl, scheduledAt } = this.props;

    return (
      <div className={classNames('datepicker', { 'datepicker--error': !this.isFiveMinutesFromNow(scheduledAt) })}>
        <div className='datepicker__hint'>
          <FormattedMessage id='datepicker.hint' defaultMessage='Scheduled to post at…' />
        </div>
        <div className='datepicker__input'>
          <DatePicker
            selected={scheduledAt}
            showTimeSelect
            dateFormat='MMMM d, yyyy h:mm aa'
            timeIntervals={15}
            wrapperClassName='react-datepicker-wrapper'
            onChange={this.setSchedule}
            placeholderText={this.props.intl.formatMessage(messages.schedule)}
            filterDate={this.isCurrentOrFutureDate}
            filterTime={this.isFiveMinutesFromNow}
            ref={this.setRef}
          />
          <div className='datepicker__cancel'>
            <IconButton size={20} title={intl.formatMessage(messages.remove)} icon='times' onClick={this.handleRemove} />
          </div>
        </div>
      </div>
    );
  }

}
