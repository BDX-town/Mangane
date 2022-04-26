import React, { useState, useCallback } from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { disableMfa } from 'soapbox/actions/mfa';
import snackbar from 'soapbox/actions/snackbar';
import { useAppDispatch } from 'soapbox/hooks';

import { Button, Form, FormGroup, Input, FormActions, Stack, Text } from '../../../components/ui';

const  messages = defineMessages({
  mfa_setup_disable_button: { id: 'column.mfa_disable_button', defaultMessage: 'Disable' },
  disableFail: { id: 'security.disable.fail', defaultMessage: 'Incorrect password. Try again.' },
  mfaDisableSuccess: { id: 'mfa.disable.success_message', defaultMessage: 'MFA disabled' },
  passwordPlaceholder: { id: 'mfa.mfa_setup.password_placeholder', defaultMessage: 'Password' },
});


const DisableOtpForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');

  const intl = useIntl();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    dispatch(disableMfa('totp', password)).then(() => {
      dispatch(snackbar.success(intl.formatMessage(messages.mfaDisableSuccess)));
      history.push('../auth/edit');
    }).finally(() => {
      setIsLoading(false);
    }).catch(() => {
      dispatch(snackbar.error(intl.formatMessage(messages.disableFail)));
    });
  }, [password, dispatch, intl]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };


  return (
    <Form onSubmit={handleSubmit}>
      <Stack>
        <Text weight='medium'>
          <FormattedMessage id='mfa.otp_enabled_title' defaultMessage='OTP Enabled' />
        </Text>

        <Text theme='muted'>
          <FormattedMessage id='mfa.otp_enabled_description' defaultMessage='You have enabled two-factor authentication via OTP.' />
        </Text>
      </Stack>

      <FormGroup
        labelText={intl.formatMessage(messages.passwordPlaceholder)}
        hintText={<FormattedMessage id='mfa.mfa_disable_enter_password' defaultMessage='Enter your current password to disable two-factor auth.' />}
      >
        <Input
          type='password'
          placeholder={intl.formatMessage(messages.passwordPlaceholder)}
          name='password'
          onChange={handleInputChange}
          disabled={isLoading}
          value={password}
          required
        />
      </FormGroup>

      <FormActions>
        <Button
          disabled={isLoading}
          theme='danger'
          type='submit'
          text={intl.formatMessage(messages.mfa_setup_disable_button)}
        />
      </FormActions>
    </Form>
  );
};

export default DisableOtpForm;