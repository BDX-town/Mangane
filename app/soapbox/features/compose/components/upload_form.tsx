import classNames from 'classnames';
import React from 'react';

import { useAppSelector } from 'soapbox/hooks';

import SensitiveButton from '../components/sensitive-button';
import UploadProgress from '../components/upload-progress';
import UploadContainer from '../containers/upload_container';

import type { Attachment as AttachmentEntity } from 'soapbox/types/entities';

const UploadForm = () => {
  const mediaIds = useAppSelector((state) => state.compose.media_attachments.map((item: AttachmentEntity) => item.id));
  const classes = classNames('compose-form__uploads-wrapper', {
    'contains-media': mediaIds.size !== 0,
  });

  return (
    <div className='compose-form__upload-wrapper'>
      <UploadProgress />

      <div className={classes}>
        {mediaIds.map((id: string) => (
          <UploadContainer id={id} key={id} />
        ))}
      </div>

      {!mediaIds.isEmpty() && <SensitiveButton />}
    </div>
  );
};

export default UploadForm;
