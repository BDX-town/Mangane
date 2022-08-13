import { Map as ImmutableMap } from 'immutable';
import React, { useState, useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import Toggle from 'react-toggle';

import { updateMrf } from 'soapbox/actions/mrf';
import snackbar from 'soapbox/actions/snackbar';
import { HStack, Modal, Stack, Text } from 'soapbox/components/ui';
import { SimpleForm } from 'soapbox/features/forms';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetRemoteInstance } from 'soapbox/selectors';

const getRemoteInstance = makeGetRemoteInstance();

const messages = defineMessages({
  mediaRemoval: { id: 'edit_federation.media_removal', defaultMessage: 'Strip media' },
  forceNsfw: { id: 'edit_federation.force_nsfw', defaultMessage: 'Force attachments to be marked sensitive' },
  unlisted: { id: 'edit_federation.unlisted', defaultMessage: 'Force posts unlisted' },
  followersOnly: { id: 'edit_federation.followers_only', defaultMessage: 'Hide posts except to followers' },
  save: { id: 'edit_federation.save', defaultMessage: 'Save' },
  success: { id: 'edit_federation.success', defaultMessage: '{host} federation was updated' },
});

interface IEditFederationModal {
  host: string,
  onClose: () => void,
}

/** Modal for moderators to edit federation with a remote instance. */
const EditFederationModal: React.FC<IEditFederationModal> = ({ host, onClose }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const remoteInstance = useAppSelector(state => getRemoteInstance(state, host));

  const [data, setData] = useState(ImmutableMap<string, any>());

  useEffect(() => {
    setData(remoteInstance.get('federation') as any);
  }, [remoteInstance]);

  const handleDataChange = (key: string): React.ChangeEventHandler<HTMLInputElement> => {
    return ({ target }) => {
      setData(data.set(key, target.checked));
    };
  };

  const handleMediaRemoval: React.ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) => {
    const newData = data.merge({
      avatar_removal: checked,
      banner_removal: checked,
      media_removal: checked,
    });

    setData(newData);
  };

  const handleSubmit = () => {
    dispatch(updateMrf(host, data))
      .then(() => dispatch(snackbar.success(intl.formatMessage(messages.success, { host }))))
      .catch(() => {});

    onClose();
  };

  const {
    avatar_removal,
    banner_removal,
    federated_timeline_removal,
    followers_only,
    media_nsfw,
    media_removal,
    reject,
  } = data.toJS() as Record<string, boolean>;

  const fullMediaRemoval = avatar_removal && banner_removal && media_removal;

  return (
    <Modal
      onClose={onClose}
      title={host}
      confirmationAction={handleSubmit}
      confirmationText={intl.formatMessage(messages.save)}
    >
      <SimpleForm onSubmit={handleSubmit}>
        <Stack space={2}>
          <HStack space={2} alignItems='center'>
            <Toggle
              checked={reject}
              onChange={handleDataChange('reject')}
              icons={false}
              id='reject'
            />

            <Text theme='muted' tag='label' size='sm' htmlFor='reject'>
              <FormattedMessage id='edit_federation.reject' defaultMessage='Reject all activities' />
            </Text>
          </HStack>
          <HStack space={2} alignItems='center'>
            <Toggle
              checked={fullMediaRemoval}
              onChange={handleMediaRemoval}
              icons={false}
              id='media_removal'
              disabled={reject}
            />

            <Text theme='muted' tag='label' size='sm' htmlFor='media_removal'>
              <FormattedMessage id='edit_federation.media_removal' defaultMessage='Strip media' />
            </Text>
          </HStack>
          <HStack space={2} alignItems='center'>
            <Toggle
              checked={media_nsfw}
              onChange={handleDataChange('media_nsfw')}
              icons={false}
              id='media_nsfw'
              disabled={reject || media_removal}
            />

            <Text theme='muted' tag='label' size='sm' htmlFor='media_nsfw'>
              <FormattedMessage id='edit_federation.force_nsfw' defaultMessage='Force attachments to be marked sensitive' />
            </Text>
          </HStack>
          <HStack space={2} alignItems='center'>
            <Toggle
              checked={followers_only}
              onChange={handleDataChange('followers_only')}
              icons={false}
              id='followers_only'
              disabled={reject}
            />

            <Text theme='muted' tag='label' size='sm' htmlFor='followers_only'>
              <FormattedMessage id='edit_federation.followers_only' defaultMessage='Hide posts except to followers' />
            </Text>
          </HStack>
          <HStack space={2} alignItems='center'>
            <Toggle
              checked={federated_timeline_removal}
              onChange={handleDataChange('federated_timeline_removal')}
              icons={false}
              id='federated_timeline_removal'
              disabled={reject || followers_only}
            />

            <Text theme='muted' tag='label' size='sm' htmlFor='federated_timeline_removal'>
              <FormattedMessage id='edit_federation.unlisted' defaultMessage='Force posts unlisted' />
            </Text>
          </HStack>
        </Stack>
      </SimpleForm>
    </Modal>
  );
};

export default EditFederationModal;
