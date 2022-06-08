import PropTypes from 'prop-types';
import * as React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import snackbar from 'soapbox/actions/snackbar';
import { verifyAge } from 'soapbox/actions/verification';
import { Button, Datepicker, Form, Text } from 'soapbox/components/ui';

const messages = defineMessages({
  fail: {
    id: 'age_verification.fail',
    defaultMessage: 'You must be {ageMinimum, plural, one {# year} other {# years}} old or older.',
  },
});

function meetsAgeMinimum(birthday, ageMinimum) {
  const month = birthday.getUTCMonth();
  const day = birthday.getUTCDate();
  const year = birthday.getUTCFullYear();

  return new Date(year + ageMinimum, month, day) <= new Date();
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
        snackbar.error(intl.formatMessage(messages.fail, {
          ageMinimum,
        })),
      );
    }
  }, [date, ageMinimum]);

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>
          <FormattedMessage id='age_verification.header' defaultMessage='Enter your birth date' />
        </h1>
      </div>

      <div className='sm:pt-10 md:w-2/3 mx-auto'>
        <Form onSubmit={handleSubmit}>
          <Datepicker onChange={onChange} />

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
