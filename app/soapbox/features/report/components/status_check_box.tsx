import noop from 'lodash/noop';
import React from 'react';
import Toggle from 'react-toggle';

import { toggleStatusReport } from 'soapbox/actions/reports';
import StatusContent from 'soapbox/components/status_content';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import Bundle from '../../ui/components/bundle';
import { MediaGallery, Video, Audio } from '../../ui/util/async-components';

interface IStatusCheckBox {
  id: string,
  disabled?: boolean,
}

const StatusCheckBox: React.FC<IStatusCheckBox> = ({ id, disabled }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.statuses.get(id));
  const checked = useAppSelector((state) => state.reports.new.status_ids.includes(id));

  const onToggle: React.ChangeEventHandler<HTMLInputElement> = (e) => dispatch(toggleStatusReport(id, e.target.checked));

  if (!status || status.reblog) {
    return null;
  }

  let media;

  if (status.media_attachments.size > 0) {
    if (status.media_attachments.some(item => item.type === 'unknown')) {
      // Do nothing
    } else if (status.media_attachments.get(0)?.type === 'video') {
      const video = status.media_attachments.get(0);

      if (video) {
        media = (
          <Bundle fetchComponent={Video} >
            {(Component: any) => (
              <Component
                preview={video.preview_url}
                blurhash={video.blurhash}
                src={video.url}
                alt={video.description}
                aspectRatio={video.meta.getIn(['original', 'aspect'])}
                width={239}
                height={110}
                inline
                sensitive={status.sensitive}
                onOpenVideo={noop}
              />
            )}
          </Bundle>
        );
      }
    } else if (status.media_attachments.get(0)?.type === 'audio') {
      const audio = status.media_attachments.get(0);

      if (audio) {
        media = (
          <Bundle fetchComponent={Audio} >
            {(Component: any) => (
              <Component
                src={audio.url}
                alt={audio.description}
                inline
                sensitive={status.sensitive}
                onOpenAudio={noop}
              />
            )}
          </Bundle>
        );
      }
    } else {
      media = (
        <Bundle fetchComponent={MediaGallery} >
          {(Component: any) => <Component media={status.media_attachments} sensitive={status.sensitive} height={110} onOpenMedia={noop} />}
        </Bundle>
      );
    }
  }

  return (
    <div className='status-check-box'>
      <div className='status-check-box__status'>
        <StatusContent status={status} />
        {media}
      </div>

      <div className='status-check-box-toggle'>
        <Toggle checked={checked} onChange={onToggle} disabled={disabled} icons={false} />
      </div>
    </div>
  );
};

export default StatusCheckBox;
