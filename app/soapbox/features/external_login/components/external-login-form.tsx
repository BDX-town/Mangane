import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';

import { externalLogin, loginWithCode } from 'soapbox/actions/external_auth';
import { Button, Form, FormActions, FormGroup, Input, Spinner } from 'soapbox/components/ui';

const messages = defineMessages({
  instanceLabel: { id: 'login.fields.instance_label', defaultMessage: 'Instance' },
  instancePlaceholder: { id: 'login.fields.instance_placeholder', defaultMessage: 'example.com' },
});

/** Form for logging into a remote instance */
const ExternalLoginForm: React.FC = () => {
  const code = new URLSearchParams(window.location.search).get('code');

  const intl = useIntl();
  const dispatch = useDispatch();

  const [host, setHost] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleHostChange: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    setHost(currentTarget.value);
  };

  const handleSubmit = () => {
    setLoading(true);

    dispatch(externalLogin(host) as any)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
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
          autoComplete='off'
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
