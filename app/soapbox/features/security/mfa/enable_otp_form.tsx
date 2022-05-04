import React, { useState, useEffect } from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { fetchBackupCodes } from 'soapbox/actions/mfa';
import snackbar from 'soapbox/actions/snackbar';
import { useAppDispatch } from 'soapbox/hooks';

import { Button, FormActions, Spinner, Stack, Text } from '../../../components/ui';

const  messages = defineMessages({
  mfaCancelButton: { id: 'column.mfa_cancel', defaultMessage: 'Cancel' },
  mfaSetupButton: { id: 'column.mfa_setup', defaultMessage: 'Proceed to Setup' },
  codesFail: { id: 'security.codes.fail', defaultMessage: 'Failed to fetch backup codes' },
});

interface IEnableOtpForm {
  displayOtpForm: boolean,
  handleSetupProceedClick: (event: React.MouseEvent) => void,
}

const EnableOtpForm: React.FC<IEnableOtpForm> = ({ displayOtpForm, handleSetupProceedClick }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const history = useHistory();

  const [backupCodes, setBackupCodes] = useState<Array<string>>([]);

  useEffect(() => {
    dispatch(fetchBackupCodes()).then(({ codes: backupCodes }: { codes: Array<string> }) => {
      setBackupCodes(backupCodes);
    })
      .catch(() => {
        dispatch(snackbar.error(intl.formatMessage(messages.codesFail)));
      });
  }, []);

  return (
    <Stack space={4}>
      <Stack space={2}>
        <Text theme='muted'>
          <FormattedMessage id='mfa.setup_warning' defaultMessage="Write these codes down or save them somewhere secure - otherwise you won't see them again. If you lose access to your 2FA app and recovery codes you'll be locked out of your account." />
        </Text>

        <div className='bg-gray-100 dark:bg-slate-900/50 rounded-lg p-4'>
          <Stack space={3}>
            <Text weight='medium' align='center'>
              <FormattedMessage id='mfa.setup_recoverycodes' defaultMessage='Recovery codes' />
            </Text>

            {backupCodes.length > 0 ? (
              <div className='grid gap-3 grid-cols-2 rounded-lg text-center'>
                {backupCodes.map((code, i) => (
                  <Text key={i} theme='muted' size='sm'>
                    {code}
                  </Text>
                ))}
              </div>
            ) : (
              <Spinner />
            )}
          </Stack>
        </div>
      </Stack>

      {!displayOtpForm && (
        <FormActions>
          <Button
            theme='ghost'
            text={intl.formatMessage(messages.mfaCancelButton)}
            onClick={() => history.push('../auth/edit')}
          />

          {backupCodes.length > 0 && (
            <Button
              theme='primary'
              text={intl.formatMessage(messages.mfaSetupButton)}
              onClick={handleSetupProceedClick}
            />
          )}
        </FormActions>
      )}
    </Stack>
  );
};

export default EnableOtpForm;
