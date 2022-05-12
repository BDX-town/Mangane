import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { fetchMfa } from 'soapbox/actions/mfa';
import List, { ListItem } from 'soapbox/components/list';
import { Button, Card, CardBody, CardHeader, CardTitle, Column } from 'soapbox/components/ui';
import { useAppSelector, useOwnAccount } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';

import Preferences from '../preferences';

const messages = defineMessages({
  settings: { id: 'settings.settings', defaultMessage: 'Settings' },
  profile: { id: 'settings.profile', defaultMessage: 'Profile' },
  security: { id: 'settings.security', defaultMessage: 'Security' },
  preferences: { id: 'settings.preferences', defaultMessage: 'Preferences' },
  editProfile: { id: 'settings.edit_profile', defaultMessage: 'Edit Profile' },
  changeEmail: { id: 'settings.change_email', defaultMessage: 'Change Email' },
  changePassword: { id: 'settings.change_password', defaultMessage: 'Change Password' },
  configureMfa: { id: 'settings.configure_mfa', defaultMessage: 'Configure MFA' },
  sessions: { id: 'settings.sessions', defaultMessage: 'Active sessions' },
  deleteAccount: { id: 'settings.delete_account', defaultMessage: 'Delete Account' },
});

/** User settings page. */
const Settings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();

  const mfa = useAppSelector((state) => state.security.get('mfa'));
  const features = useAppSelector((state) => getFeatures(state.instance));
  const account = useOwnAccount();

  const navigateToChangeEmail = React.useCallback(() => history.push('/settings/email'), [history]);
  const navigateToChangePassword = React.useCallback(() => history.push('/settings/password'), [history]);
  const navigateToMfa = React.useCallback(() => history.push('/settings/mfa'), [history]);
  const navigateToSessions = React.useCallback(() => history.push('/settings/tokens'), [history]);
  const navigateToEditProfile = React.useCallback(() => history.push('/settings/profile'), [history]);

  const isMfaEnabled = mfa.getIn(['settings', 'totp']);

  React.useEffect(() => {
    dispatch(fetchMfa());
  }, [dispatch]);

  if (!account) return null;

  const displayName = account.display_name || account.username;

  return (
    <Column label={intl.formatMessage(messages.settings)} transparent withHeader={false}>
      <Card variant='rounded'>
        <CardHeader>
          <CardTitle title={intl.formatMessage(messages.profile)} />
        </CardHeader>

        <CardBody>
          <List>
            <ListItem label={intl.formatMessage(messages.editProfile)} onClick={navigateToEditProfile}>
              <span>{displayName}</span>
            </ListItem>
          </List>
        </CardBody>

        <CardHeader>
          <CardTitle title={intl.formatMessage(messages.security)} />
        </CardHeader>

        <CardBody>
          <List>
            <ListItem label={intl.formatMessage(messages.changeEmail)} onClick={navigateToChangeEmail} />
            <ListItem label={intl.formatMessage(messages.changePassword)} onClick={navigateToChangePassword} />
            <ListItem label={intl.formatMessage(messages.configureMfa)} onClick={navigateToMfa}>
              {isMfaEnabled ?
                intl.formatMessage({ id: 'mfa.enabled', defaultMessage: 'Enabled' }) :
                intl.formatMessage({ id: 'mfa.disabled', defaultMessage: 'Disabled' })}
            </ListItem>
            {features.sessionsAPI && (
              <ListItem label={intl.formatMessage(messages.sessions)} onClick={navigateToSessions} />
            )}
          </List>
        </CardBody>

        <CardHeader>
          <CardTitle title={intl.formatMessage(messages.preferences)} />
        </CardHeader>

        <CardBody>
          <Preferences />
        </CardBody>

        <CardBody>
          <div className='mt-4 w-full flex justify-center'>
            <Button theme='danger' to='/settings/account'>
              {intl.formatMessage(messages.deleteAccount)}
            </Button>
          </div>
        </CardBody>
      </Card>
    </Column>
  );
};

export default Settings;
