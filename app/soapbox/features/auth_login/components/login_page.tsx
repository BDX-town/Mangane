import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { logIn, verifyCredentials, switchAccount } from 'soapbox/actions/auth';
import { fetchInstance } from 'soapbox/actions/instance';
import { closeModal } from 'soapbox/actions/modals';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { getRedirectUrl } from 'soapbox/utils/redirect';
import { isStandalone } from 'soapbox/utils/state';

import LoginForm from './login_form';
import OtpAuthForm from './otp_auth_form';

import type { AxiosError } from 'axios';

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const me = useAppSelector((state) => state.me);
  const standalone = useAppSelector((state) => isStandalone(state));

  const token = new URLSearchParams(window.location.search).get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [mfaAuthNeeded, setMfaAuthNeeded] = useState(!!token);
  const [mfaToken, setMfaToken] = useState(token || '');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const getFormData = (form: HTMLFormElement) => {
    return Object.fromEntries(
      Array.from(form).map((i: any) => [i.name, i.value]),
    );
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    const { username, password } = getFormData(event.target as HTMLFormElement);
    dispatch(logIn(username, password)).then(({ access_token }) => {
      return dispatch(verifyCredentials(access_token as string))
        // Refetch the instance for authenticated fetch
        .then(() => dispatch(fetchInstance() as any));
    }).then((account: { id: string }) => {
      dispatch(closeModal());
      setShouldRedirect(true);
      if (typeof me === 'string') {
        dispatch(switchAccount(account.id));
      }
    }).catch((error: AxiosError) => {
      const data: any = error.response?.data;
      if (data?.error === 'mfa_required') {
        setMfaAuthNeeded(true);
        setMfaToken(data.mfa_token);
      }
      setIsLoading(false);
    });
    setIsLoading(true);
    event.preventDefault();
  };

  if (standalone) return <Redirect to='/login/external' />;

  if (shouldRedirect) {
    const redirectUri = getRedirectUrl();
    return <Redirect to={redirectUri} />;
  }

  if (mfaAuthNeeded) return <OtpAuthForm mfa_token={mfaToken} />;

  return <LoginForm handleSubmit={handleSubmit} isLoading={isLoading} />;
};

export default LoginPage;
