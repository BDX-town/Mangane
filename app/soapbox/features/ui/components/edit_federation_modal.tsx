import { Map as ImmutableMap } from 'immutable';
import React, { useState, useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { updateMrf } from 'soapbox/actions/mrf';
import snackbar from 'soapbox/actions/snackbar';
import { SimpleForm, Checkbox } from 'soapbox/features/forms';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';
import { makeGetRemoteInstance } from 'soapbox/selectors';

const getRemoteInstance = makeGetRemoteInstance();

const messages = defineMessages({
  reject: { id: 'edit_federation.reject', defaultMessage: 'Reject all activities' },
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

  const handleSubmit: React.FormEventHandler = () => {
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
    <div className='modal-root__modal edit-federation-modal'>
      <div>
        <div className='edit-federation-modal__title'>
          {host}
        </div>
        <SimpleForm onSubmit={handleSubmit}>
          <Checkbox
            label={intl.formatMessage(messages.reject)}
            checked={reject}
            onChange={handleDataChange('reject')}
          />
          <Checkbox
            label={intl.formatMessage(messages.mediaRemoval)}
            disabled={reject}
            checked={fullMediaRemoval}
            onChange={handleMediaRemoval}
          />
          <Checkbox
            label={intl.formatMessage(messages.forceNsfw)}
            disabled={reject || media_removal}
            checked={media_nsfw}
            onChange={handleDataChange('media_nsfw')}
          />
          <Checkbox
            label={intl.formatMessage(messages.followersOnly)}
            disabled={reject}
            checked={followers_only}
            onChange={handleDataChange('followers_only')}
          />
          <Checkbox
            label={intl.formatMessage(messages.unlisted)}
            disabled={reject || followers_only}
            checked={federated_timeline_removal}
            onChange={handleDataChange('federated_timeline_removal')}
          />
          <button type='submit' className='edit-federation-modal__submit'>
            {intl.formatMessage(messages.save)}
          </button>
        </SimpleForm>
      </div>
    </div>
  );
};

export default EditFederationModal;
