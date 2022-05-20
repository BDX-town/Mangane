import React from 'react';
import { useDispatch } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import Bundle from 'soapbox/features/ui/components/bundle';
import { MediaGallery } from 'soapbox/features/ui/util/async-components';

import type { List as ImmutableList } from 'immutable';

interface IAttachmentThumbs {
  media: ImmutableList<Immutable.Record<any>>
  onClick?(): void
  sensitive?: boolean
}

const AttachmentThumbs = (props: IAttachmentThumbs) => {
  const { media, onClick, sensitive } = props;
  const dispatch = useDispatch();

  const renderLoading = () => <div className='media-gallery--compact' />;
  const onOpenMedia = (media: Immutable.Record<any>, index: number) => dispatch(openModal('MEDIA', { media, index }));

  return (
    <div className='attachment-thumbs'>
      <Bundle fetchComponent={MediaGallery} loading={renderLoading}>
        {(Component: any) => (
          <Component
            media={media}
            onOpenMedia={onOpenMedia}
            height={50}
            compact
            sensitive={sensitive}
          />
        )}
      </Bundle>

      {onClick && (
        <div className='attachment-thumbs__clickable-region' onClick={onClick} />
      )}
    </div>
  );
};

export default AttachmentThumbs;
