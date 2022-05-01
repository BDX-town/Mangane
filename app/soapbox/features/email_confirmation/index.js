import PropTypes from 'prop-types';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import snackbar from 'soapbox/actions/snackbar';
import { Spinner } from 'soapbox/components/ui';

import { confirmChangedEmail } from '../../actions/security';
import { buildErrorMessage } from '../../utils/errors';

const Statuses = {
  IDLE: 'IDLE',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

const token = new URLSearchParams(window.location.search).get('confirmation_token');

const EmailConfirmation = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [status, setStatus] = React.useState(Statuses.IDLE);

  React.useEffect(() => {
    if (token) {
      dispatch(confirmChangedEmail(token))
        .then(() => {
          setStatus(Statuses.SUCCESS);

          dispatch(
            snackbar.success(
              intl.formatMessage({
                id: 'email_confirmation.success',
                defaultMessage: 'Your email has been confirmed!',
              }),
            ),
          );
        })
        .catch((error) => {
          setStatus(Statuses.FAIL);

          if (error.response.data.error) {
            const defaultMessage = buildErrorMessage(error.response.data.error);

            dispatch(
              snackbar.error(
                intl.formatMessage({
                  id: 'email_confirmation.fail',
                  defaultMessage,
                }),
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

EmailConfirmation.propTypes = {
  history: PropTypes.object,
};

export default EmailConfirmation;
