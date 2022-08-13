import React, { useEffect, useState } from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { fetchMfa } from 'soapbox/actions/mfa';
import { Card, CardBody, CardHeader, CardTitle, Column, Stack } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

import DisableOtpForm from './mfa/disable_otp_form';
import EnableOtpForm from './mfa/enable_otp_form';
import OtpConfirmForm from './mfa/otp_confirm_form';

/*
Security settings page for user account
Routed to /settings/mfa
Includes following features:
- Set up Multi-factor Auth
*/

const messages = defineMessages({
  heading: { id: 'column.mfa', defaultMessage: 'Multi-Factor Authentication' },
});

const MfaForm: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [displayOtpForm, setDisplayOtpForm] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchMfa());
  }, []);

  const handleSetupProceedClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setDisplayOtpForm(true);
  };

  const mfa = useAppSelector((state) => state.security.get('mfa'));

  return (
    <Column label={intl.formatMessage(messages.heading)} transparent withHeader={false}>
      <Card variant='rounded'>
        <CardHeader backHref='/settings'>
          <CardTitle title={intl.formatMessage(messages.heading)} />
        </CardHeader>

        <CardBody>
          {mfa.getIn(['settings', 'totp']) ? (
            <DisableOtpForm />
          ) : (
            <Stack space={4}>
              <EnableOtpForm displayOtpForm={displayOtpForm} handleSetupProceedClick={handleSetupProceedClick} />
              {displayOtpForm && <OtpConfirmForm />}
            </Stack>
          )}
        </CardBody>
      </Card>
    </Column>
  );
};

export default MfaForm;
