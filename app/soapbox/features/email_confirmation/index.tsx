import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

import { confirmChangedEmail } from 'soapbox/actions/security';
import snackbar from 'soapbox/actions/snackbar';
import { Spinner } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';
import { buildErrorMessage } from 'soapbox/utils/errors';

const Statuses = {
  IDLE: 'IDLE',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

const messages = defineMessages({
  success: { id: 'email_confirmation.success', defaultMessage: 'Your email has been confirmed!' },
});

const token = new URLSearchParams(window.location.search).get('confirmation_token');

const EmailConfirmation = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [status, setStatus] = React.useState(Statuses.IDLE);

  React.useEffect(() => {
    if (token) {
      dispatch(confirmChangedEmail(token))
        .then(() => {
          setStatus(Statuses.SUCCESS);

          dispatch(
            snackbar.success(
              intl.formatMessage(messages.success),
            ),
          );
        })
        .catch((error) => {
          setStatus(Statuses.FAIL);

          if (error.response.data.error) {
            const message = buildErrorMessage(error.response.data.error);

            dispatch(
              snackbar.error(
                message,
                // intl.formatMessage({
                //   id: 'email_confirmation.fail',
                //   defaultMessage,
                // }),
              ),
            );
          }
        });
    }
  }, [token]);

  if (!token || status === Statuses.SUCCESS || status === Statuses.FAIL) {
    return <Redirect to='/' />;
  }

  return (
    <Spinner />
  );
};

export default EmailConfirmation;
