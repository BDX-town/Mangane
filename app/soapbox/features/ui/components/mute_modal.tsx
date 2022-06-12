import React from 'react';
import { FormattedMessage } from 'react-intl';
import Toggle from 'react-toggle';

import { muteAccount } from 'soapbox/actions/accounts';
import { closeModal } from 'soapbox/actions/modals';
import { toggleHideNotifications } from 'soapbox/actions/mutes';
import { Modal, HStack, Stack, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const getAccount = makeGetAccount();

const MuteModal = () => {
  const dispatch = useAppDispatch();

  const account = useAppSelector((state) => getAccount(state, state.mutes.new.accountId!));
  const notifications = useAppSelector((state) => state.mutes.new.notifications);

  if (!account) return null;

  const handleClick = () => {
    dispatch(closeModal());
    dispatch(muteAccount(account.id, notifications));
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const toggleNotifications = () => {
    dispatch(toggleHideNotifications());
  };

  return (
    <Modal
      title={
        <FormattedMessage
          id='confirmations.mute.heading'
          defaultMessage='Mute @{name}'
          values={{ name: account.acct }}
        />
      }
      onClose={handleCancel}
      confirmationAction={handleClick}
      confirmationText={<FormattedMessage id='confirmations.mute.confirm' defaultMessage='Mute' />}
      cancelText={<FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />}
      cancelAction={handleCancel}
    >
      <Stack space={4}>
        <Text>
          <FormattedMessage
            id='confirmations.mute.message'
            defaultMessage='Are you sure you want to mute {name}?'
            values={{ name: <strong>@{account.acct}</strong> }}
          />
        </Text>

        <label>
          <HStack alignItems='center' space={2}>
            <Text tag='span'>
              <FormattedMessage id='mute_modal.hide_notifications' defaultMessage='Hide notifications from this user?' />
            </Text>

            <Toggle
              checked={notifications}
              onChange={toggleNotifications}
              icons={false}
            />
          </HStack>
        </label>
      </Stack>
    </Modal>
  );
};

export default MuteModal;
