import React from 'react';

import Icon from 'soapbox/components/icon';

import type { Attachment as AttachmentEntity } from 'soapbox/types/entities';

const filename = (url: string) => url.split('/').pop()!.split('#')[0].split('?')[0];

interface IAttachmentList {
  media: AttachmentEntity[],
  compact?: boolean,
}

const AttachmentList: React.FC<IAttachmentList> = ({ media, compact }) => {
  if (compact) {
    return (
      <div className='attachment-list compact'>
        <ul className='attachment-list__list'>
          {media.map(attachment => {
            const displayUrl = attachment.get('remote_url') || attachment.get('url');

            return (
              <li key={attachment.get('id')}>
                <a href={displayUrl} target='_blank' rel='noopener'><Icon id='link' /> {filename(displayUrl)}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className='attachment-list'>
      <div className='attachment-list__icon'>
        <Icon id='link' />
      </div>

      <ul className='attachment-list__list'>
        {media.map(attachment => {
          const displayUrl = attachment.get('remote_url') || attachment.get('url');

          return (
            <li key={attachment.get('id')}>
              <a href={displayUrl} target='_blank' rel='noopener'>{filename(displayUrl)}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AttachmentList;
