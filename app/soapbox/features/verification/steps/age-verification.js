import PropTypes from 'prop-types';
import * as React from 'react';
import DatePicker from 'react-datepicker';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import snackbar from 'soapbox/actions/snackbar';
import { verifyAge } from 'soapbox/actions/verification';

import { Button, Form, FormGroup, Text } from '../../../components/ui';

function meetsAgeMinimum(birthday, ageMinimum) {
  const month = birthday.getUTCMonth();
  const day = birthday.getUTCDate();
  const year = birthday.getUTCFullYear();

  return new Date(year + ageMinimum, month, day) <= new Date();
}

function getMaximumDate(ageMinimum) {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() - ageMinimum);

  return date;
}

const AgeVerification = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.verification.get('isLoading'));
  const ageMinimum = useSelector((state) => state.verification.get('ageMinimum'));
  const siteTitle = useSelector((state) => state.instance.get('title'));

  const [date, setDate] = React.useState('');
  const isValid = typeof date === 'object';

  const onChange = React.useCallback((date) => setDate(date), []);

  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();

    const birthday = new Date(date);

    if (meetsAgeMinimum(birthday, ageMinimum)) {
      dispatch(verifyAge(birthday));
    } else {
      dispatch(
        snackbar.error(
          intl.formatMessage({
            id: 'age_verification.fail',
            defaultMessage: `You must be ${ageMinimum} years old or older.`,
          }),
        ),
      );
    }
  }, [date, ageMinimum]);

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>
          {intl.formatMessage({ id: 'age_verification.header', defaultMessage: 'Enter your birth date' })}
        </h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText='Birth Date'>
            <DatePicker
              selected={date}
              dateFormat='MMMM d, yyyy'
              onChange={onChange}
              showMonthDropdown
              showYearDropdown
              maxDate={getMaximumDate(ageMinimum)}
              className='block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              dropdownMode='select'
              required
            />
          </FormGroup>

          <Text theme='muted' size='sm'>
            {siteTitle} requires users to be at least {ageMinimum} years old to
            access its platform. Anyone under the age of {ageMinimum} years old
            cannot access this platform.
          </Text>

          <div className='text-center'>
            <Button block theme='primary' type='submit' disabled={isLoading || !isValid}>Next</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

AgeVerification.propTypes = {
  verifyAge: PropTypes.func,
};

export default AgeVerification;
