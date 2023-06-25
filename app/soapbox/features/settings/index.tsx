import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { fetchMfa } from 'soapbox/actions/mfa';
import List, { ListItem } from 'soapbox/components/list';
import { Card, CardBody, CardHeader, CardTitle, Column } from 'soapbox/components/ui';
import { useAppSelector, useOwnAccount } from 'soapbox/hooks';
import { ConfigDB } from 'soapbox/utils/config_db';
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
  accountMigration: { id: 'settings.account_migration', defaultMessage: 'Move Account' },
  accountAliases: { id: 'navigation_bar.account_aliases', defaultMessage: 'Account aliases' },
  other: { id: 'settings.other', defaultMessage: 'Other options' },
  mfaEnabled: { id: 'mfa.enabled', defaultMessage: 'Enabled' },
  mfaDisabled: { id: 'mfa.disabled', defaultMessage: 'Disabled' },
  content: { id: 'settings.content', defaultMessage: 'Content' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domainBlocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
});

/** User settings page. */
const Settings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();

  const mfa = useAppSelector((state) => state.security.get('mfa'));
  const configuration = useAppSelector((state) => state.admin.get('configs'));
  const features = useAppSelector((state) => getFeatures(state.instance));
  const account = useOwnAccount();

  const navigateToChangeEmail = () => history.push('/settings/email');
  const navigateToChangePassword = () => history.push('/settings/password');
  const navigateToMfa = () => history.push('/settings/mfa');
  const navigateToSessions = () => history.push('/settings/tokens');
  const navigateToEditProfile = () => history.push('/settings/profile');
  const navigateToDeleteAccount = () => history.push('/settings/account');
  const navigateToMoveAccount = () => history.push('/settings/migration');
  const navigateToAliases = () => history.push('/settings/aliases');

  const navigateToBlocks = () => history.push('/blocks');
  const navigateToMutes = () => history.push('/mutes');
  const navigateToDomainBlocks = () => history.push('/domain_blocks');
  const navigateToFilters = () => history.push('/filters');

  const isMfaEnabled = mfa.getIn(['settings', 'totp']);
  const isLdapEnabled = React.useMemo(() => ConfigDB.find(configuration, ':pleroma', ':ldap')?.get('value').find((e) => e.get('tuple').get(0) === ':enabled')?.getIn(['tuple', 1]), [configuration]);

  useEffect(() => {
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
          <CardTitle title={intl.formatMessage(messages.content)} />
        </CardHeader>

        <CardBody>
          <List>
            <ListItem label={intl.formatMessage(messages.blocks)} onClick={navigateToBlocks} />
            <ListItem label={intl.formatMessage(messages.mutes)} onClick={navigateToMutes} />
            {
              features.federating && <ListItem label={intl.formatMessage(messages.domainBlocks)} onClick={navigateToDomainBlocks} />
            }
            {
              features.filters && <ListItem label={intl.formatMessage(messages.filters)} onClick={navigateToFilters} />
            }
          </List>
        </CardBody>

        {(features.security || features.sessions) && (
          <>
            <CardHeader>
              <CardTitle title={intl.formatMessage(messages.security)} />
            </CardHeader>

            <CardBody>
              <List>
                {features.security && (
                  <>
                    <ListItem label={intl.formatMessage(messages.changeEmail)} onClick={navigateToChangeEmail} />
                    {
                      !isLdapEnabled && (
                        <ListItem label={intl.formatMessage(messages.changePassword)} onClick={navigateToChangePassword} />
                      )
                    }
                    <ListItem label={intl.formatMessage(messages.configureMfa)} onClick={navigateToMfa}>
                      {isMfaEnabled ?
                        intl.formatMessage(messages.mfaEnabled) :
                        intl.formatMessage(messages.mfaDisabled)}
                    </ListItem>
                  </>
                )}
                {features.sessions && (
                  <ListItem label={intl.formatMessage(messages.sessions)} onClick={navigateToSessions} />
                )}
              </List>
            </CardBody>
          </>
        )}

        <CardHeader>
          <CardTitle title={intl.formatMessage(messages.preferences)} />
        </CardHeader>

        <CardBody>
          <Preferences />
        </CardBody>

        {(features.security || features.accountAliases) && (
          <>
            <CardHeader>
              <CardTitle title={intl.formatMessage(messages.other)} />
            </CardHeader>

            <CardBody>
              <List>
                {features.security && (
                  <ListItem label={intl.formatMessage(messages.deleteAccount)} onClick={navigateToDeleteAccount} />
                )}
                {features.federating && (features.accountMoving ? (
                  <ListItem label={intl.formatMessage(messages.accountMigration)} onClick={navigateToMoveAccount} />
                ) : features.accountAliases && (
                  <ListItem label={intl.formatMessage(messages.accountAliases)} onClick={navigateToAliases} />
                ))}
              </List>
            </CardBody>
          </>
        )}
      </Card>
    </Column>
  );
};

export default Settings;
