import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import OtpInput from 'react-otp-input';

import { verifyCredentials } from 'soapbox/actions/auth';
import { closeModal } from 'soapbox/actions/modals';
import snackbar from 'soapbox/actions/snackbar';
import { reConfirmPhoneVerification, reRequestPhoneVerification } from 'soapbox/actions/verification';
import { FormGroup, PhoneInput, Modal, Stack, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { getAccessToken } from 'soapbox/utils/auth';

interface IVerifySmsModal {
  onClose: (type: string) => void,
}

enum Statuses {
  IDLE = 'IDLE',
  READY = 'READY',
  REQUESTED = 'REQUESTED',
  FAIL = 'FAIL',
  SUCCESS = 'SUCCESS',
}

const VerifySmsModal: React.FC<IVerifySmsModal> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const accessToken = useAppSelector((state) => getAccessToken(state));
  const title = useAppSelector((state) => state.instance.title);
  const isLoading = useAppSelector((state) => state.verification.isLoading);

  const [status, setStatus] = useState<Statuses>(Statuses.IDLE);
  const [phone, setPhone] = useState<string>();
  const [verificationCode, setVerificationCode] = useState('');
  const [requestedAnother, setAlreadyRequestedAnother] = useState(false);

  const isValid = !!phone;

  const onChange = useCallback((phone?: string) => {
    setPhone(phone);
  }, []);

  const handleSubmit = (event: React.MouseEvent) => {
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

    dispatch(reRequestPhoneVerification(phone!)).then(() => {
      dispatch(
        snackbar.success(
          intl.formatMessage({
            id: 'sms_verification.success',
            defaultMessage: 'A verification code has been sent to your phone number.',
          }),
        ),
      );
    })
      .finally(() => setStatus(Statuses.REQUESTED))
      .catch(() => {
        dispatch(
          snackbar.error(
            intl.formatMessage({
              id: 'sms_verification.fail',
              defaultMessage: 'Failed to send SMS message to your phone number.',
            }),
          ),
        );
      });
  };

  const resendVerificationCode = (event?: React.MouseEvent<HTMLButtonElement>) => {
    setAlreadyRequestedAnother(true);
    handleSubmit(event as React.MouseEvent<HTMLButtonElement>);
  };

  const onConfirmationClick = (event: any) => {
    switch (status) {
      case Statuses.IDLE:
        setStatus(Statuses.READY);
        break;
      case Statuses.READY:
        handleSubmit(event);
        break;
      case Statuses.REQUESTED:
        submitVerification();
        break;
      default: break;
    }
  };

  const confirmationText = useMemo(() => {
    switch (status) {
      case Statuses.IDLE:
        return intl.formatMessage({
          id: 'sms_verification.modal.verify_sms',
          defaultMessage: 'Verify SMS',
        });
      case Statuses.READY:
        return intl.formatMessage({
          id: 'sms_verification.modal.verify_number',
          defaultMessage: 'Verify phone number',
        });
      case Statuses.REQUESTED:
        return intl.formatMessage({
          id: 'sms_verification.modal.verify_code',
          defaultMessage: 'Verify code',
        });
      default:
        return null;
    }
  }, [status]);

  const renderModalBody = () => {
    switch (status) {
      case Statuses.IDLE:
        return (
          <Text theme='muted'>
            {intl.formatMessage({
              id: 'sms_verification.modal.verify_help_text',
              defaultMessage: 'Verify your phone number to start using {instance}.',
            }, {
              instance: title,
            })}
          </Text>
        );
      case Statuses.READY:
        return (
          <FormGroup labelText='Phone Number'>
            <PhoneInput
              value={phone}
              onChange={onChange}
              required
              autoFocus
            />
          </FormGroup>
        );
      case Statuses.REQUESTED:
        return (
          <>
            <Text theme='muted' size='sm' align='center'>
              {intl.formatMessage({
                id: 'sms_verification.modal.enter_code',
                defaultMessage: 'We sent you a 6-digit code via SMS. Enter it below.',
              })}
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
          </>
        );
      default:
        return null;
    }
  };

  const submitVerification = () => {
    // TODO: handle proper validation from Pepe -- expired vs invalid
    dispatch(reConfirmPhoneVerification(verificationCode))
      .then(() => {
        setStatus(Statuses.SUCCESS);
        // eslint-disable-next-line promise/catch-or-return
        dispatch(verifyCredentials(accessToken))
          .then(() => dispatch(closeModal('VERIFY_SMS')));

      })
      .catch(() => dispatch(
        snackbar.error(
          intl.formatMessage({
            id: 'sms_verification.invalid',
            defaultMessage: 'Your SMS token has expired.',
          }),
        ),
      ));
  };

  useEffect(() => {
    if (verificationCode.length === 6) {
      submitVerification();
    }
  }, [verificationCode]);

  return (
    <Modal
      title={
        intl.formatMessage({
          id: 'sms_verification.modal.verify_title',
          defaultMessage: 'Verify your phone number',
        })
      }
      onClose={() => onClose('VERIFY_SMS')}
      cancelAction={status === Statuses.IDLE ? () => onClose('VERIFY_SMS') : undefined}
      cancelText='Skip for now'
      confirmationAction={onConfirmationClick}
      confirmationText={confirmationText}
      secondaryAction={status === Statuses.REQUESTED ? resendVerificationCode : undefined}
      secondaryText={status === Statuses.REQUESTED ? intl.formatMessage({
        id: 'sms_verification.modal.resend_code',
        defaultMessage: 'Resend verification code?',
      }) : undefined}
      secondaryDisabled={requestedAnother}
    >
      <Stack space={4}>
        {renderModalBody()}
      </Stack>
    </Modal>
  );
};

export default VerifySmsModal;
