import React, { useState } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { remoteInteraction } from 'soapbox/actions/interactions';
import snackbar from 'soapbox/actions/snackbar';
import { Button, Modal, Stack, Text } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch, useFeatures, useSoapboxConfig } from 'soapbox/hooks';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  accountPlaceholder: { id: 'remote_interaction.account_placeholder', defaultMessage: 'Enter your username@domain you want to act from' },
  userNotFoundError: { id: 'remote_interaction.user_not_found_error', defaultMessage: 'Couldn\'t find given user' },
});

interface IUnauthorizedModal {
  /** Unauthorized action type. */
  action: 'FOLLOW' | 'REPLY' | 'REBLOG' | 'FAVOURITE' | 'POLL_VOTE',
  /** Close event handler. */
  onClose: (modalType: string) => void,
  /** ActivityPub ID of the account OR status being acted upon. */
  ap_id?: string,
  /** Account ID of the account being acted upon. */
  account?: string,
}

/** Modal to display when a logged-out user tries to do something that requires login. */
const UnauthorizedModal: React.FC<IUnauthorizedModal> = ({ action, onClose, account: accountId, ap_id: apId }) => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { singleUserMode } = useSoapboxConfig();
  const siteTitle = useAppSelector(state => state.instance.title);
  const username = useAppSelector(state => state.accounts.get(accountId)?.display_name);
  const features = useFeatures();

  const [account, setAccount] = useState('');

  const onAccountChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setAccount(e.target.value);
  };

  const onClickClose = () => {
    onClose('UNAUTHORIZED');
  };

  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();

    dispatch(remoteInteraction(apId, account))
      .then(url => {
        window.open(url, '_new', 'noopener,noreferrer');
        onClose('UNAUTHORIZED');
      })
      .catch(error => {
        if (error.message === 'Couldn\'t find user') {
          dispatch(snackbar.error(intl.formatMessage(messages.userNotFoundError)));
        }
      });
  };

  const onLogin = () => {
    history.push('/login');
    onClickClose();
  };

  const onRegister = () => {
    history.push('/signup');
    onClickClose();
  };

  const renderRemoteInteractions = () => {
    let header;
    let button;

    if (action === 'FOLLOW') {
      header = <FormattedMessage id='remote_interaction.follow_title' defaultMessage='Follow {user} remotely' values={{ user: username }} />;
      button = <FormattedMessage id='remote_interaction.follow' defaultMessage='Proceed to follow' />;
    } else if (action === 'REPLY') {
      header = <FormattedMessage id='remote_interaction.reply_title' defaultMessage='Reply to a post remotely' />;
      button = <FormattedMessage id='remote_interaction.reply' defaultMessage='Proceed to reply' />;
    } else if (action === 'REBLOG') {
      header = <FormattedMessage id='remote_interaction.reblog_title' defaultMessage='Reblog a post remotely' />;
      button = <FormattedMessage id='remote_interaction.reblog' defaultMessage='Proceed to repost' />;
    } else if (action === 'FAVOURITE') {
      header = <FormattedMessage id='remote_interaction.favourite_title' defaultMessage='Like a post remotely' />;
      button = <FormattedMessage id='remote_interaction.favourite' defaultMessage='Proceed to like' />;
    } else if (action === 'POLL_VOTE') {
      header = <FormattedMessage id='remote_interaction.poll_vote_title' defaultMessage='Vote in a poll remotely' />;
      button = <FormattedMessage id='remote_interaction.poll_vote' defaultMessage='Proceed to vote' />;
    }

    return (
      <Modal
        title={header}
        onClose={onClickClose}
        confirmationAction={!singleUserMode ? onLogin : undefined}
        confirmationText={<FormattedMessage id='account.login' defaultMessage='Log in' />}
        secondaryAction={onRegister}
        secondaryText={<FormattedMessage id='account.register' defaultMessage='Sign up' />}
      >
        <div className='remote-interaction-modal__content'>
          <form className='simple_form remote-interaction-modal__fields' onSubmit={onSubmit}>
            <input
              type='text'
              placeholder={intl.formatMessage(messages.accountPlaceholder)}
              name='remote_follow[acct]'
              value={account}
              autoCorrect='off'
              autoCapitalize='off'
              onChange={onAccountChange}
              required
            />
            <Button type='submit' theme='primary'>{button}</Button>
          </form>
          <div className='remote-interaction-modal__divider'>
            <Text align='center'>
              <FormattedMessage id='remote_interaction.divider' defaultMessage='or' />
            </Text>
          </div>
          {!singleUserMode && (
            <Text size='lg' weight='medium'>
              <FormattedMessage id='unauthorized_modal.title' defaultMessage='Sign up for {site_title}' values={{ site_title: siteTitle }} />
            </Text>
          )}
        </div>
      </Modal>
    );
  };

  if (action && features.remoteInteractionsAPI && features.federating) {
    return renderRemoteInteractions();
  }

  return (
    <Modal
      title={<FormattedMessage id='unauthorized_modal.title' defaultMessage='Sign up for {site_title}' values={{ site_title: siteTitle }} />}
      onClose={onClickClose}
      confirmationAction={onLogin}
      confirmationText={<FormattedMessage id='account.login' defaultMessage='Log in' />}
      secondaryAction={onRegister}
      secondaryText={<FormattedMessage id='account.register' defaultMessage='Sign up' />}
    >
      <Stack>
        <Text>
          <FormattedMessage id='unauthorized_modal.text' defaultMessage='You need to be logged in to do that.' />
        </Text>
      </Stack>
    </Modal>
  );
};

export default UnauthorizedModal;
