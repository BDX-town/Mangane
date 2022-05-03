import noop from 'lodash/noop';
import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { openModal } from 'soapbox/actions/modals';
import { deleteStatusModal } from 'soapbox/actions/moderation';
import StatusContent from 'soapbox/components/status_content';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import Bundle from 'soapbox/features/ui/components/bundle';
import { MediaGallery, Video, Audio } from 'soapbox/features/ui/util/async-components';
import { useAppDispatch } from 'soapbox/hooks';

import type { Map as ImmutableMap } from 'immutable';
import type { Status, Attachment } from 'soapbox/types/entities';

const messages = defineMessages({
  viewStatus: { id: 'admin.reports.actions.view_status', defaultMessage: 'View post' },
  deleteStatus: { id: 'admin.statuses.actions.delete_status', defaultMessage: 'Delete post' },
});

interface IReportStatus {
  status: Status,
  report?: ImmutableMap<string, any>,
}

const ReportStatus: React.FC<IReportStatus> = ({ status }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const handleOpenMedia = (media: Attachment, index: number) => {
    dispatch(openModal('MEDIA', { media, index }));
  };

  const handleDeleteStatus = () => {
    dispatch(deleteStatusModal(intl, status.id));
  };

  const makeMenu = () => {
    const acct = status.getIn(['account', 'acct']);

    return [{
      text: intl.formatMessage(messages.viewStatus, { acct: `@${acct}` }),
      to: `/@${acct}/posts/${status.get('id')}`,
      icon: require('@tabler/icons/icons/pencil.svg'),
    }, {
      text: intl.formatMessage(messages.deleteStatus, { acct: `@${acct}` }),
      action: handleDeleteStatus,
      icon: require('@tabler/icons/icons/trash.svg'),
      destructive: true,
    }];
  };

  const getMedia = () => {
    const firstAttachment = status.media_attachments.get(0);

    if (firstAttachment) {
      if (status.media_attachments.some(item => item.type === 'unknown')) {
        // Do nothing
      } else if (firstAttachment.type === 'video') {
        const video = firstAttachment;

        return (
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
      } else if (firstAttachment.type === 'audio') {
        const audio = firstAttachment;

        return (
          <Bundle fetchComponent={Audio}>
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
      } else {
        return (
          <Bundle fetchComponent={MediaGallery}>
            {(Component: any) => (
              <Component
                media={status.media_attachments}
                sensitive={status.sensitive}
                height={110}
                onOpenMedia={handleOpenMedia}
              />
            )}
          </Bundle>
        );
      }
    }

    return null;
  };

  const media = getMedia();
  const menu = makeMenu();

  return (
    <div className='admin-report__status'>
      <div className='admin-report__status-content'>
        <StatusContent status={status} />
        {media}
      </div>
      <div className='admin-report__status-actions'>
        <DropdownMenu
          items={menu}
          src={require('@tabler/icons/icons/dots-vertical.svg')}
        />
      </div>
    </div>
  );
};

export default ReportStatus;
