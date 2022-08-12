import { List as ImmutableList } from 'immutable';
import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Button, Form, FormActions, FormGroup, HStack, Input, Stack } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import ConsumerButton from './consumer-button';

const messages = defineMessages({
  username: {
    id: 'login.fields.username_label',
    defaultMessage: 'Email or username',
  },
  password: {
    id: 'login.fields.password_placeholder',
    defaultMessage: 'Password',
  },
});

interface ILoginForm {
  isLoading: boolean,
  handleSubmit: React.FormEventHandler,
}

const LoginForm: React.FC<ILoginForm> = ({ isLoading, handleSubmit }) => {
  const intl = useIntl();
  const providers = useAppSelector(state => ImmutableList<string>(state.instance.pleroma.get('oauth_consumer_strategies')));

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-800 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'><FormattedMessage id='login_form.header' defaultMessage='Sign In' /></h1>
      </div>

      <Stack className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto' space={3}>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText={intl.formatMessage(messages.username)}>
            <Input
              aria-label={intl.formatMessage(messages.username)}
              placeholder={intl.formatMessage(messages.username)}
              type='text'
              name='username'
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

        {(providers.size > 0) && (
          <HStack space={2}>
            {providers.map(provider => (
              <ConsumerButton provider={provider} />
            ))}
          </HStack>
        )}
      </Stack>
    </div>
  );
};

export default LoginForm;
