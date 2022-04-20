import { List as ImmutableList } from 'immutable';
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { Spinner, Widget } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';
import { getAccountGallery } from 'soapbox/selectors';

import { expandAccountMediaTimeline } from '../../../actions/timelines';
import MediaItem from '../../account_gallery/components/media_item';

import type { Account, Attachment } from 'soapbox/types/entities';

interface IProfileMediaPanel {
  account?: Account,
}

const ProfileMediaPanel: React.FC<IProfileMediaPanel> = ({ account }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const attachments: ImmutableList<Attachment> = useAppSelector((state) => account ? getAccountGallery(state, account?.id) : ImmutableList());

  const handleOpenMedia = (attachment: Attachment): void => {
    if (attachment.type === 'video') {
      dispatch(openModal('VIDEO', { media: attachment, status: attachment.status }));
    } else {
      const media = attachment.getIn(['status', 'media_attachments']) as ImmutableList<Attachment>;
      const index = media.findIndex(x => x.id === attachment.id);

      dispatch(openModal('MEDIA', { media, index, status: attachment.status, account: attachment.account }));
    }
  };

  useEffect(() => {
    setLoading(true);

    if (account) {
      dispatch(expandAccountMediaTimeline(account.id))
        // @ts-ignore yes it does
        .then(() => setLoading(false))
        .catch(() => {});
    }
  }, [account?.id]);

  const renderAttachments = () => {
    const publicAttachments = attachments.filter(attachment => attachment.getIn(['status', 'visibility']) === 'public');
    const nineAttachments = publicAttachments.slice(0, 9);

    if (!nineAttachments.isEmpty()) {
      return (
        <div className='media-panel__list'>
          {nineAttachments.map((attachment, _index) => (
            <MediaItem
              key={`${attachment.getIn(['status', 'id'])}+${attachment.id}`}
              attachment={attachment}
              displayWidth={255}
              onOpenMedia={handleOpenMedia}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className='media-panel__empty'>
          <FormattedMessage id='media_panel.empty_message' defaultMessage='No media found.' />
        </div>
      );
    }
  };

  return (
    <Widget title={<FormattedMessage id='media_panel.title' defaultMessage='Media' />}>
      {account && (
        <div className='media-panel__content'>
          {loading ? (
            <Spinner />
          ) : (
            renderAttachments()
          )}
        </div>
      )}
    </Widget>
  );
};

export default ProfileMediaPanel;
