import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'react-datepicker';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  birthDatePlaceholder: { id: 'edit_profile.fields.birthday_placeholder', defaultMessage: 'Your birth date' },
});

const mapStateToProps = state => {
  const features = getFeatures(state.get('instance'));

  return {
    supportsBirthDates: features.birthDates,
    minAge: state.getIn(['instance', 'pleroma', 'metadata', 'birthday_min_age']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class EditProfile extends ImmutablePureComponent {

  static propTypes = {
    hint: PropTypes.node,
    required: PropTypes.bool,
    supportsBirthDates: PropTypes.bool,
    minAge: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.instanceOf(Date),
  };

  render() {
    const { intl, value, onChange, supportsBirthDates, hint, required, minAge } = this.props;

    if (!supportsBirthDates) return null;

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - minAge);

    return (
      <div className='datepicker'>
        {hint && (
          <div className='datepicker__hint'>
            {hint}
          </div>
        )}
        <div className='datepicker__input'>
          <DatePicker
            selected={value}
            dateFormat='d MMMM yyyy'
            wrapperClassName='react-datepicker-wrapper'
            onChange={onChange}
            placeholderText={intl.formatMessage(messages.birthDatePlaceholder)}
            maxDate={maxDate}
            required={required}
          />
        </div>
      </div>
    );
  }

}