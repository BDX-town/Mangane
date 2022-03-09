import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import IconButton from 'soapbox/components/icon_button';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { DatePicker } from 'soapbox/features/ui/util/async-components';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  birthdayPlaceholder: { id: 'edit_profile.fields.birthday_placeholder', defaultMessage: 'Your birthday' },
  previousMonth: { id: 'datepicker.previous_month', defaultMessage: 'Previous month' },
  nextMonth: { id: 'datepicker.next_month', defaultMessage: 'Next month' },
  previousYear: { id: 'datepicker.previous_year', defaultMessage: 'Previous year' },
  nextYear: { id: 'datepicker.next_year', defaultMessage: 'Next year' },
});

const mapStateToProps = state => {
  const features = getFeatures(state.get('instance'));

  return {
    supportsBirthdays: features.birthdays,
    minAge: state.getIn(['instance', 'pleroma', 'metadata', 'birthday_min_age']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class BirthdayInput extends ImmutablePureComponent {

  static propTypes = {
    hint: PropTypes.node,
    required: PropTypes.bool,
    supportsBirthdays: PropTypes.bool,
    minAge: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.instanceOf(Date),
  };

  renderHeader = ({
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    decreaseYear,
    increaseYear,
    prevYearButtonDisabled,
    nextYearButtonDisabled,
    date,
  }) => {
    const { intl } = this.props;

    return (
      <div className='datepicker__header'>
        <div className='datepicker__months'>
          <IconButton
            className='datepicker__button'
            src={require('@tabler/icons/icons/chevron-left.svg')}
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            aria-label={intl.formatMessage(messages.previousMonth)}
            title={intl.formatMessage(messages.previousMonth)}
          />
          {intl.formatDate(date, { month: 'long' })}
          <IconButton
            className='datepicker__button'
            src={require('@tabler/icons/icons/chevron-right.svg')}
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            aria-label={intl.formatMessage(messages.nextMonth)}
            title={intl.formatMessage(messages.nextMonth)}
          />
        </div>
        <div className='datepicker__years'>
          <IconButton
            className='datepicker__button'
            src={require('@tabler/icons/icons/chevron-left.svg')}
            onClick={decreaseYear}
            disabled={prevYearButtonDisabled}
            aria-label={intl.formatMessage(messages.previousYear)}
            title={intl.formatMessage(messages.previousYear)}
          />
          {intl.formatDate(date, { year: 'numeric' })}
          <IconButton
            className='datepicker__button'
            src={require('@tabler/icons/icons/chevron-right.svg')}
            onClick={increaseYear}
            disabled={nextYearButtonDisabled}
            aria-label={intl.formatMessage(messages.nextYear)}
            title={intl.formatMessage(messages.nextYear)}
          />
        </div>
      </div>
    );
  }

  render() {
    const { intl, value, onChange, supportsBirthdays, hint, required, minAge } = this.props;

    if (!supportsBirthdays) return null;

    let maxDate = new Date();
    maxDate = new Date(maxDate.getTime() - minAge * 1000 * 60 * 60 * 24 + maxDate.getTimezoneOffset() * 1000 * 60);

    return (
      <div className='datepicker'>
        {hint && (
          <div className='datepicker__hint'>
            {hint}
          </div>
        )}
        <div className='datepicker__input'>
          <BundleContainer fetchComponent={DatePicker}>
            {Component => (<Component
              selected={value}
              wrapperClassName='react-datepicker-wrapper'
              onChange={onChange}
              placeholderText={intl.formatMessage(messages.birthdayPlaceholder)}
              minDate={new Date('1900-01-01')}
              maxDate={maxDate}
              required={required}
              renderCustomHeader={this.renderHeader}
            />)}
          </BundleContainer>
        </div>
      </div>
    );
  }

}
