import * as React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

import { resetPasswordConfirm } from 'soapbox/actions/security';
import { Button, Form, FormActions, FormGroup, Input } from 'soapbox/components/ui';
import PasswordIndicator from 'soapbox/features/verification/components/password-indicator';
import { useAppDispatch, useFeatures } from 'soapbox/hooks';

const token = new URLSearchParams(window.location.search).get('reset_password_token');

const messages = defineMessages({
  resetPasswordFail: { id: 'reset_password.fail', defaultMessage: 'Expired token, please try again.' },
});

const Statuses = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

const PasswordResetConfirm = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { passwordRequirements } = useFeatures();

  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState(Statuses.IDLE);
  const [hasValidPassword, setHasValidPassword] = React.useState<boolean>(passwordRequirements ? false : true);

  const isLoading = status === Statuses.LOADING;

  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();

    setStatus(Statuses.LOADING);
    dispatch(resetPasswordConfirm(password, token as string))
      .then(() => setStatus(Statuses.SUCCESS))
      .catch(() => setStatus(Statuses.FAIL));
  }, [password]);

  const onChange = React.useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  const renderErrors = () => {
    if (status === Statuses.FAIL) {
      return [intl.formatMessage(messages.resetPasswordFail)];
    }

    return [];
  };

  if (status === Statuses.SUCCESS) {
    return <Redirect to='/' />;
  }

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-600 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>
          <FormattedMessage id='reset_password.header' defaultMessage='Set New Password' />
        </h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText='Password' errors={renderErrors()}>
            <Input
              type='password'
              name='password'
              placeholder='Password'
              onChange={onChange}
              required
            />

            {passwordRequirements && (
              <PasswordIndicator password={password} onChange={setHasValidPassword} />
            )}
          </FormGroup>

          <FormActions>
            <Button type='submit' theme='primary' disabled={isLoading || !hasValidPassword}>
              <FormattedMessage id='password_reset.reset' defaultMessage='Reset password' />
            </Button>
          </FormActions>
        </Form>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
