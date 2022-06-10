import * as React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logIn, verifyCredentials } from 'soapbox/actions/auth';
import { fetchInstance } from 'soapbox/actions/instance';
import { startOnboarding } from 'soapbox/actions/onboarding';
import snackbar from 'soapbox/actions/snackbar';
import { createAccount, removeStoredVerification } from 'soapbox/actions/verification';
import { Button, Form, FormGroup, Input } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';
import { getRedirectUrl } from 'soapbox/utils/redirect';

import PasswordIndicator from './components/password-indicator';

import type { AxiosError } from 'axios';

const messages = defineMessages({
  success: {
    id: 'registrations.success',
    defaultMessage: 'Welcome to {siteTitle}!',
  },
  usernameTaken: {
    id: 'registrations.unprocessable_entity',
    defaultMessage: 'This username has already been taken.',
  },
  error: {
    id: 'registrations.error',
    defaultMessage: 'Failed to register your account.',
  },
});

const initialState = {
  username: '',
  password: '',
};

const Registration = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const isLoading = useAppSelector((state) => state.verification.get('isLoading') as boolean);
  const siteTitle = useAppSelector((state) => state.instance.title);

  const [state, setState] = React.useState(initialState);
  const [shouldRedirect, setShouldRedirect] = React.useState<boolean>(false);
  const [hasValidPassword, setHasValidPassword] = React.useState<boolean>(false);
  const { username, password } = state;

  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();

    dispatch(createAccount(username, password))
      .then(() => dispatch(logIn(intl, username, password)))
      .then(({ access_token }: any) => dispatch(verifyCredentials(access_token)))
      .then(() => dispatch(fetchInstance()))
      .then(() => {
        setShouldRedirect(true);
        removeStoredVerification();
        dispatch(startOnboarding());
        dispatch(
          snackbar.success(
            intl.formatMessage(messages.success, { siteTitle }),
          ),
        );
      })
      .catch((error: AxiosError) => {
        if (error?.response?.status === 422) {
          dispatch(
            snackbar.error(
              intl.formatMessage(messages.usernameTaken),
            ),
          );
        } else {
          dispatch(
            snackbar.error(
              intl.formatMessage(messages.error),
            ),
          );
        }
      });
  }, [username, password]);

  const handleInputChange = React.useCallback((event) => {
    event.persist();

    setState((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
  }, []);

  if (shouldRedirect) {
    const redirectUri = getRedirectUrl();
    return <Redirect to={redirectUri} />;
  }

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>
          <FormattedMessage id='registration.header' defaultMessage='Register your account' />
        </h1>
      </div>

      <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto space-y-4'>
        <Form onSubmit={handleSubmit}>
          <FormGroup labelText='Your username'>
            <Input
              name='username'
              type='text'
              value={username}
              onChange={handleInputChange}
              required
              icon={require('@tabler/icons/icons/at.svg')}
            />
          </FormGroup>

          <FormGroup labelText='Password'>
            <Input
              name='password'
              type='password'
              value={password}
              onChange={handleInputChange}
              required
              data-testid='password-input'
            />

            <PasswordIndicator password={password} onChange={setHasValidPassword} />
          </FormGroup>

          <div className='text-center'>
            <Button
              block
              theme='primary'
              type='submit'
              disabled={isLoading || !hasValidPassword}
            >
              Register
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Registration;
