import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';

import { externalLogin, loginWithCode } from 'soapbox/actions/external_auth';
import snackbar from 'soapbox/actions/snackbar';
import { Button, Form, FormActions, FormGroup, Input, Spinner } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';

import type { AxiosError } from 'axios';

const messages = defineMessages({
  instanceLabel: { id: 'login.fields.instance_label', defaultMessage: 'Instance' },
  instancePlaceholder: { id: 'login.fields.instance_placeholder', defaultMessage: 'example.com' },
  instanceFailed: { id: 'login_external.errors.instance_fail', defaultMessage: 'The instance returned an error.' },
  networkFailed: { id: 'login_external.errors.network_fail', defaultMessage: 'Connection failed. Is a browser extension blocking it?' },
});

/** Form for logging into a remote instance */
const ExternalLoginForm: React.FC = () => {
  const code = new URLSearchParams(window.location.search).get('code');

  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [host, setHost] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleHostChange: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    setHost(currentTarget.value);
  };

  const handleSubmit = () => {
    setLoading(true);

    dispatch(externalLogin(host))
      .then(() => setLoading(false))
      .catch((error: AxiosError) => {
        console.error(error);
        const status = error.response?.status;

        if (status) {
          dispatch(snackbar.error(intl.formatMessage(messages.instanceFailed)));
        } else if (!status && error.code === 'ERR_NETWORK') {
          dispatch(snackbar.error(intl.formatMessage(messages.networkFailed)));
        }

        setLoading(false);
      });
  };

  useEffect(() => {
    if (code) {
      dispatch(loginWithCode(code));
    }
  }, [code]);

  if (code) {
    return <Spinner />;
  }

  return (
    <Form onSubmit={handleSubmit} data-testid='external-login'>
      <FormGroup labelText={intl.formatMessage(messages.instanceLabel)}>
        <Input
          aria-label={intl.formatMessage(messages.instancePlaceholder)}
          placeholder={intl.formatMessage(messages.instancePlaceholder)}
          type='text'
          name='host'
          onChange={handleHostChange}
          autoCorrect='off'
          autoCapitalize='off'
          required
        />
      </FormGroup>

      <FormActions>
        <Button theme='primary' type='submit' disabled={isLoading}>
          <FormattedMessage id='login.log_in' defaultMessage='Log in' />
        </Button>
      </FormActions>
    </Form>
  );
};

export default ExternalLoginForm;
