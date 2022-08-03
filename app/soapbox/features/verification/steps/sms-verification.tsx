import { AxiosError } from 'axios';
import React from 'react';
import { useIntl } from 'react-intl';
import OtpInput from 'react-otp-input';

import snackbar from 'soapbox/actions/snackbar';
import { confirmPhoneVerification, requestPhoneVerification } from 'soapbox/actions/verification';
import { Button, Form, FormGroup, PhoneInput, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

const Statuses = {
  IDLE: 'IDLE',
  REQUESTED: 'REQUESTED',
  FAIL: 'FAIL',
};

const SmsVerification = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) => state.verification.isLoading) as boolean;

  const [phone, setPhone] = React.useState<string>();
  const [status, setStatus] = React.useState(Statuses.IDLE);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [requestedAnother, setAlreadyRequestedAnother] = React.useState(false);

  const isValid = !!phone;

  const onChange = React.useCallback((phone?: string) => {
    setPhone(phone);
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

    dispatch(requestPhoneVerification(phone!)).then(() => {
      dispatch(
        snackbar.success(
          intl.formatMessage({
            id: 'sms_verification.success',
            defaultMessage: 'A verification code has been sent to your phone number.',
          }),
        ),
      );
      setStatus(Statuses.REQUESTED);
    }).catch((error: AxiosError) => {
      const message = (error.response?.data as any)?.message || intl.formatMessage({
        id: 'sms_verification.fail',
        defaultMessage: 'Failed to send SMS message to your phone number.',
      });

      dispatch(snackbar.error(message));
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
        <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-800 border-solid -mx-4 sm:-mx-10'>
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
            inputStyle='w-10i border-gray-300 dark:bg-gray-800 dark:border-gray-800 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
          />

          <div className='text-center'>
            <Button
              size='sm'
              type='button'
              theme='tertiary'
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
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-800 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>{intl.formatMessage({ id: 'sms_verification.header', defaultMessage: 'Enter your phone number' })}</h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText='Phone Number'>
            <PhoneInput
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

export { SmsVerification as default };
