import PropTypes from 'prop-types';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import snackbar from 'soapbox/actions/snackbar';
import { confirmEmailVerification } from 'soapbox/actions/verification';
import { Icon, Spinner, Stack, Text } from 'soapbox/components/ui';

const Statuses = {
  IDLE: 'IDLE',
  SUCCESS: 'SUCCESS',
  GENERIC_FAIL: 'GENERIC_FAIL',
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
};

const messages = defineMessages({
  emailConfirmedHeading: { id: 'email_passthru.confirmed.heading', defaultMessage: 'Email Confirmed!' },
  emailConfirmedBody: { id: 'email_passthru.confirmed.body', defaultMessage: 'Close this tab and continue the registration process on the {bold} from which you sent this email confirmation.' },
  genericFailHeading: { id: 'email_passthru.generic_fail.heading', defaultMessage: 'Something Went Wrong' },
  genericFailBody: { id: 'email_passthru.generic_fail.body', defaultMessage: 'Please request a new email confirmation.' },
  tokenNotFoundHeading: { id: 'email_passthru.token_not_found.heading', defaultMessage: 'Invalid Token' },
  tokenNotFoundBody: { id: 'email_passthru.token_not_found.body', defaultMessage: 'Your email token was not found. Please request a new email confirmation from the {bold} from which you sent this email confirmation.' },
  tokenExpiredHeading: { id: 'email_passthru.token_expired.heading', defaultMessage: 'Token Expired' },
  tokenExpiredBody: { id: 'email_passthru.token_expired.body', defaultMessage: 'Your email token has expired. Please request a new email confirmation from the {bold} from which you sent this email confirmation.' },
});

const Success = () => {
  const intl = useIntl();

  return (
    <Stack space={4} alignItems='center'>
      <Icon src={require('@tabler/icons/icons/circle-check.svg')} className='text-primary-600 dark:text-primary-400 h-10 w-10' />
      <Text size='3xl' weight='semibold' align='center'>
        {intl.formatMessage(messages.emailConfirmedHeading)}
      </Text>
      <Text theme='muted' align='center'>
        {intl.formatMessage(messages.emailConfirmedBody, { bold: <Text tag='span' weight='medium'>same device</Text> })}
      </Text>
    </Stack>
  );
};

const GenericFail = () => {
  const intl = useIntl();

  return (
    <Stack space={4} alignItems='center'>
      <Icon src={require('@tabler/icons/icons/circle-x.svg')} className='text-danger-600 h-10 w-10' />
      <Text size='3xl' weight='semibold' align='center'>
        {intl.formatMessage(messages.genericFailHeading)}
      </Text>
      <Text theme='muted' align='center'>
        {intl.formatMessage(messages.genericFailBody)}
      </Text>
    </Stack>
  );
};

const TokenNotFound = () => {
  const intl = useIntl();

  return (
    <Stack space={4} alignItems='center'>
      <Icon src={require('@tabler/icons/icons/circle-x.svg')} className='text-danger-600 h-10 w-10' />
      <Text size='3xl' weight='semibold' align='center'>
        {intl.formatMessage(messages.tokenNotFoundHeading)}
      </Text>
      <Text theme='muted' align='center'>
        {intl.formatMessage(messages.tokenNotFoundBody, { bold: <Text tag='span' weight='medium'>same device</Text> })}

      </Text>
    </Stack>
  );
};

const TokenExpired = () => {
  const intl = useIntl();

  return (
    <Stack space={4} alignItems='center'>
      <Icon src={require('@tabler/icons/icons/circle-x.svg')} className='text-danger-600 h-10 w-10' />
      <Text size='3xl' weight='semibold' align='center'>
        {intl.formatMessage(messages.tokenExpiredHeading)}
      </Text>
      <Text theme='muted' align='center'>
        {intl.formatMessage(messages.tokenExpiredBody, { bold: <Text tag='span' weight='medium'>same device</Text> })}
      </Text>
    </Stack>
  );
};

const EmailPassThru = ({ match }) => {
  const { token } = match.params;

  const dispatch = useDispatch();
  const intl = useIntl();

  const [status, setStatus] = React.useState(Statuses.IDLE);

  React.useEffect(() => {
    if (token) {
      dispatch(confirmEmailVerification(token))
        .then(() => {
          setStatus(Statuses.SUCCESS);
          dispatch(snackbar.success(intl.formatMessage({ id: 'email_passthru.success', defaultMessage: 'Your email has been verified!' })));
        })
        .catch((error) => {
          const errorKey = error?.response?.data?.error;
          let message = intl.formatMessage({
            id: 'email_passthru.fail.generic',
            defaultMessage: 'Unable to confirm your email',
          });

          if (errorKey) {
            switch (errorKey) {
              case 'token_expired':
                message = intl.formatMessage({
                  id: 'email_passthru.fail.expired',
                  defaultMessage: 'Your email token has expired.',
                });
                setStatus(Statuses.TOKEN_EXPIRED);
                break;
              case 'token_not_found':
                message = intl.formatMessage({
                  id: 'email_passthru.fail.not_found',
                  defaultMessage: 'Your email token is invalid.',
                });
                message = 'Your token is invalid';
                setStatus(Statuses.TOKEN_NOT_FOUND);
                break;
              default:
                setStatus(Statuses.GENERIC_FAIL);
                break;
            }
          }

          dispatch(snackbar.error(message));
        });
    }
  }, [token]);

  switch (status) {
    case Statuses.SUCCESS:
      return <Success />;
    case Statuses.TOKEN_EXPIRED:
      return <TokenExpired />;
    case Statuses.TOKEN_NOT_FOUND:
      return <TokenNotFound />;
    case Statuses.GENERIC_FAIL:
      return <GenericFail />;
    default:
      return <Spinner />;
  }
};

EmailPassThru.propTypes = {
  match: PropTypes.object,
};

export default EmailPassThru;
