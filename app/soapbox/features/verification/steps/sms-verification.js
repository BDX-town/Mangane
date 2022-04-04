import * as React from 'react';
import { useIntl } from 'react-intl';
import OtpInput from 'react-otp-input';
import {  useDispatch, useSelector } from 'react-redux';

import snackbar from 'soapbox/actions/snackbar';
import { confirmPhoneVerification, requestPhoneVerification } from 'soapbox/actions/verification';
import { formatPhoneNumber } from 'soapbox/utils/phone';

import { Button, Form, FormGroup, Input, Text } from '../../../components/ui';

const Statuses = {
  IDLE: 'IDLE',
  REQUESTED: 'REQUESTED',
  FAIL: 'FAIL',
};

const validPhoneNumberRegex = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}/;

const SmsVerification = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.verification.get('isLoading'));

  const [phone, setPhone] = React.useState('');
  const [status, setStatus] = React.useState(Statuses.IDLE);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [requestedAnother, setAlreadyRequestedAnother] = React.useState(false);

  const isValid = validPhoneNumberRegex.test(phone);

  const onChange = React.useCallback((event) => {
    const formattedPhone = formatPhoneNumber(event.target.value);

    setPhone(formattedPhone);
  }, []);

  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();

    if (!isValid) {
      setStatus(Statuses.IDLE);
      dispatch(
        snackbar.error(
          intl.formatMessage({
            id: 'sms_verification.invalid',
            defaultMessage: 'Please enter a valid phone number.',
          }),
        ),
      );
      return;
    }

    dispatch(requestPhoneVerification(phone)).then(() => {
      dispatch(
        snackbar.success(
          intl.formatMessage({
            id: 'sms_verification.success',
            defaultMessage: 'A verification code has been sent to your phone number.',
          }),
        ),
      );
      setStatus(Statuses.REQUESTED);
    }).catch(() => {
      dispatch(
        snackbar.error(
          intl.formatMessage({
            id: 'sms_verification.fail',
            defaultMessage: 'Failed to send SMS message to your phone number.',
          }),
        ),
      );
      setStatus(Statuses.FAIL);
    });
  }, [phone, isValid]);

  const resendVerificationCode = React.useCallback((event) => {
    setAlreadyRequestedAnother(true);
    handleSubmit(event);
  }, [isValid]);

  const submitVerification = () => {
    // TODO: handle proper validation from Pepe -- expired vs invalid
    dispatch(confirmPhoneVerification(verificationCode))
      .catch(() => dispatch(
        snackbar.error(
          intl.formatMessage({
            id: 'sms_verification.invalid',
            defaultMessage: 'Your SMS token has expired.',
          }),
        ),
      ));
  };

  React.useEffect(() => {
    if (verificationCode.length === 6) {
      submitVerification();
    }
  }, [verificationCode]);

  if (status === Statuses.REQUESTED) {
    return (
      <div>
        <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
          <h1 className='text-center font-bold text-2xl'>
            {intl.formatMessage({ id: 'sms_verification.sent.header', defaultMessage: 'Verification code' })}
          </h1>
        </div>

        <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto space-y-4'>
          <Text theme='muted' size='sm' align='center'>
            We sent you a 6-digit code via SMS. Enter it below.
          </Text>

          <OtpInput
            value={verificationCode}
            onChange={setVerificationCode}
            numInputs={6}
            isInputNum
            shouldAutoFocus
            isDisabled={isLoading}
            containerStyle='flex justify-center mt-2 space-x-4'
            inputStyle='w-10i border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          />

          <div className='text-center'>
            <Button
              size='sm'
              type='button'
              theme='ghost'
              onClick={resendVerificationCode}
              disabled={requestedAnother}
            >
              Resend verification code?
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>{intl.formatMessage({ id: 'sms_verification.header', defaultMessage: 'Enter your phone number' })}</h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText='Phone Number'>
            <Input
              type='text'
              value={phone}
              onChange={onChange}
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


export default SmsVerification;
