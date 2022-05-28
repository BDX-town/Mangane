import React, { useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

import { resetPassword } from 'soapbox/actions/security';
import snackbar from 'soapbox/actions/snackbar';
import { Button, Form, FormActions, FormGroup, Input } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';

const messages = defineMessages({
  nicknameOrEmail: { id: 'password_reset.fields.username_placeholder', defaultMessage: 'Email or username' },
  confirmation: { id: 'password_reset.confirmation', defaultMessage: 'Check your email for confirmation.' },
});

const PasswordReset = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<Element>) => {
    const nicknameOrEmail = (e.target as any).nickname_or_email.value;
    setIsLoading(true);
    dispatch(resetPassword(nicknameOrEmail)).then(() => {
      setIsLoading(false);
      setSuccess(true);
      dispatch(snackbar.info(intl.formatMessage(messages.confirmation)));
    }).catch(() => {
      setIsLoading(false);
    });
  };

  if (success) return <Redirect to='/' />;

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-600 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>
          <FormattedMessage id='password_reset.header' defaultMessage='Reset Password' />
        </h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText={intl.formatMessage(messages.nicknameOrEmail)}>
            <Input
              type='text'
              name='nickname_or_email'
              placeholder='me@example.com'
              required
            />
          </FormGroup>

          <FormActions>
            <Button type='submit' theme='primary' disabled={isLoading}>
              <FormattedMessage id='password_reset.reset' defaultMessage='Reset password' />
            </Button>
          </FormActions>
        </Form>
      </div>
    </div>
  );
};

export default PasswordReset;
