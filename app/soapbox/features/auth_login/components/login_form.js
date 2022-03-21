import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Button, Form, FormActions, FormGroup, Input } from '../../../components/ui';

const messages = defineMessages({
  username: {
    id: 'login.fields.username_placeholder',
    defaultMessage: 'Username',
  },
  email: {
    id: 'login.fields.email_placeholder',
    defaultMessage: 'Email address',
  },
  password: {
    id: 'login.fields.password_placeholder',
    defaultMessage: 'Password',
  },
});

const LoginForm = ({ isLoading, handleSubmit }) => {
  const intl = useIntl();

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>{intl.formatMessage({ id: 'login_form.header', defaultMessage: 'Sign In' })}</h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
        <Form onSubmit={handleSubmit} disabled={isLoading}>
          <FormGroup labelText={intl.formatMessage(messages.email)}>
            <Input
              aria-label={intl.formatMessage(messages.email)}
              placeholder={intl.formatMessage(messages.email)}
              type='text'
              name='username'
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              required
            />
          </FormGroup>

          <FormGroup
            labelText={intl.formatMessage(messages.password)}
            hintText={
              <Link to='/reset-password' className='hover:underline'>
                <FormattedMessage
                  id='login.reset_password_hint'
                  defaultMessage='Trouble logging in?'
                />
              </Link>
            }
          >
            <Input
              aria-label={intl.formatMessage(messages.password)}
              placeholder={intl.formatMessage(messages.password)}
              type='password'
              name='password'
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              required
            />
          </FormGroup>
          <FormActions>
            <Button
              theme='primary'
              type='submit'
              disabled={isLoading}
            >
              <FormattedMessage id='login.sign_in' defaultMessage='Sign in' />
            </Button>
          </FormActions>
        </Form>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginForm;
