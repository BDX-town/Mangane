import PropTypes from 'prop-types';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import snackbar from 'soapbox/actions/snackbar';
import { checkEmailVerification, requestEmailVerification } from 'soapbox/actions/verification';
import { postEmailVerification } from 'soapbox/actions/verification';
import Icon from 'soapbox/components/icon';
import { Button, Form, FormGroup, Input, Text } from 'soapbox/components/ui';

const Statuses = {
  IDLE: 'IDLE',
  REQUESTED: 'REQUESTED',
  FAIL: 'FAIL',
};

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+$/;

const EmailSent = ({ handleSubmit }) => {
  const dispatch = useDispatch();

  const checkEmailConfirmation = () => {
    dispatch(checkEmailVerification())
      .then(() => dispatch(postEmailVerification()))
      .catch(() => null);
  };

  React.useEffect(() => {
    const intervalId = setInterval(() => checkEmailConfirmation(), 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='sm:pt-10 mx-auto flex flex-col items-center justify-center'>
      <Icon src={require('@tabler/icons/icons/send.svg')} className='text-primary-600 dark:text-primary-400 h-12 w-12 mb-5' />

      <div className='space-y-1 text-center mb-4'>
        <Text weight='bold' size='3xl'>We sent you an email</Text>
        <Text theme='muted'>Click on the link in the email to validate your email.</Text>
      </div>

      <Button theme='ghost' onClick={handleSubmit}>Resend verification email</Button>
    </div>
  );
};

const EmailVerification = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.verification.get('isLoading'));

  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState(Statuses.IDLE);
  const [errors, setErrors] = React.useState([]);

  const isValid = email.length > 0 && EMAIL_REGEX.test(email);

  const onChange = React.useCallback((event) => setEmail(event.target.value), []);

  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();
    setErrors([]);

    submitEmailForVerification();
  }, [email]);

  const submitEmailForVerification = () => {
    return dispatch(requestEmailVerification((email)))
      .then(() => {
        setStatus(Statuses.REQUESTED);

        dispatch(
          snackbar.success(
            intl.formatMessage({
              id: 'email_verification.exists',
              defaultMessage: 'Verification email sent successfully.',
            }),
          ),
        );
      })
      .catch(error => {
        const isEmailTaken = error.response?.data?.error === 'email_taken';

        const message = isEmailTaken ? (
          intl.formatMessage({ id: 'email_verification.exists', defaultMessage: 'This email has already been taken.' })
        ) : (
          intl.formatMessage({ id: 'email_verification.fail', defaultMessage: 'Failed to request email verification.' })
        );

        if (isEmailTaken) {
          setErrors([intl.formatMessage({ id: 'email_verification.taken', defaultMessage: 'is taken' })]);
        }

        dispatch(snackbar.error(message));
        setStatus(Statuses.FAIL);
      });
  };

  if (status === Statuses.REQUESTED) {
    return <EmailSent handleSubmit={handleSubmit} />;
  }

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>{intl.formatMessage({ id: 'email_verification.header', defaultMessage: 'Enter your email address' })}</h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText='Email Address' errors={errors}>
            <Input
              type='email'
              value={email}
              name='email'
              onChange={onChange}
              placeholder='you@email.com'
              required
            />
          </FormGroup>

          <div className='text-center'>
            <Button block theme='primary' type='submit' disabled={isLoading || !isValid}>Next</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

EmailSent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default EmailVerification;
