import React from 'react';

import AttachmentThumbs from 'soapbox/components/attachment-thumbs';
import { Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { isRtl } from 'soapbox/rtl';

import type { Status } from 'soapbox/types/entities';

interface IReplyIndicator {
  status?: Status,
  onCancel?: () => void,
  hideActions: boolean,
}

const ReplyIndicator: React.FC<IReplyIndicator> = ({ status, hideActions, onCancel }) => {
  const handleClick = () => {
    onCancel!();
  };

  if (!status) {
    return null;
  }

  let actions = {};
  if (!hideActions && onCancel) {
    actions = {
      onActionClick: handleClick,
      actionIcon: require('@tabler/icons/x.svg'),
      actionAlignment: 'top',
      actionTitle: 'Dismiss',
    };
  }

  return (
    <Stack space={2} className='p-4 rounded-lg bg-gray-100 dark:bg-slate-700'>
      <AccountContainer
        {...actions}
        id={status.getIn(['account', 'id']) as string}
        timestamp={status.created_at}
        showProfileHoverCard={false}
        withLinkToProfile={false}
      />

      <Text
        className='break-words status__content'
        size='sm'
        dangerouslySetInnerHTML={{ __html: status.contentHtml }}
        direction={isRtl(status.search_index) ? 'rtl' : 'ltr'}
      />

      {status.media_attachments.size > 0 && (
        <AttachmentThumbs
          media={status.media_attachments}
          sensitive={status.sensitive}
        />
      )}
    </Stack>
  );
};

export default ReplyIndicator;
