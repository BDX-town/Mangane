import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Video from 'soapbox/features/video';

import type { Status, Account, Attachment } from 'soapbox/types/entities';

interface IVideoModal {
  media: Attachment,
  status: Status,
  account: Account,
  time: number,
  onClose: () => void,
}

const VideoModal: React.FC<IVideoModal> = ({ status, account, media, time, onClose }) => {
  const history = useHistory();

  const handleStatusClick: React.MouseEventHandler = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      history.push(`/@${account.acct}/posts/${status.id}`);
    }
  };

  const link = status && account && (
    <a href={status.url} onClick={handleStatusClick}>
      <FormattedMessage id='lightbox.view_context' defaultMessage='View context' />
    </a>
  );

  return (
    <div className='block w-full max-w-xl mx-auto overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl pointer-events-auto'>
      <Video
        preview={media.preview_url}
        blurhash={media.blurhash}
        src={media.url}
        startTime={time}
        onCloseVideo={onClose}
        link={link}
        detailed
        alt={media.description}
      />
    </div>
  );
};

export default VideoModal;
