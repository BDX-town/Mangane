import { AxiosError } from 'axios';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logIn, verifyCredentials } from 'soapbox/actions/auth';
import { fetchInstance } from 'soapbox/actions/instance';
import { startOnboarding } from 'soapbox/actions/onboarding';
import snackbar from 'soapbox/actions/snackbar';
import { createAccount } from 'soapbox/actions/verification';
import { removeStoredVerification } from 'soapbox/actions/verification';
import { useAppSelector } from 'soapbox/hooks';

import { Button, Form, FormGroup, Input } from '../../components/ui';

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
  const { username, password } = state;

  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();

    // TODO: handle validation errors from Pepe
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
            intl.formatMessage({
              id: 'registrations.success',
              defaultMessage: 'Welcome to {siteTitle}!',
            }, { siteTitle }),
          ),
        );
      })
      .catch((error: AxiosError) => {
        if (error?.response?.status === 422) {
          dispatch(
            snackbar.error(
              intl.formatMessage({
                id: 'registrations.unprocessable_entity',
                defaultMessage: 'This username has already been taken.',
              }),
            ),
          );
        } else {
          dispatch(
            snackbar.error(
              intl.formatMessage({
                id: 'registrations.error',
                defaultMessage: 'Failed to register your account.',
              }),
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
    return <Redirect to='/' />;
  }

  return (
    <div>
      <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
        <h1 className='text-center font-bold text-2xl'>
          {intl.formatMessage({ id: 'registration.header', defaultMessage: 'Register your account' })}
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
            />
          </FormGroup>

          <div className='text-center'>
            <Button block theme='primary' type='submit' disabled={isLoading}>Register</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Registration;
