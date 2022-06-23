import classNames from 'classnames';
import React from 'react';

import AttachmentThumbs from 'soapbox/components/attachment-thumbs';
import StatusReplyMentions from 'soapbox/components/status-reply-mentions';
import StatusContent from 'soapbox/components/status_content';
import { HStack } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import PollPreview from 'soapbox/features/ui/components/poll_preview';
import { useAppSelector } from 'soapbox/hooks';

import { buildStatus } from '../builder';

import ScheduledStatusActionBar from './scheduled_status_action_bar';

import type { Account as AccountEntity, Status as StatusEntity } from 'soapbox/types/entities';

interface IScheduledStatus {
  statusId: string,
}

const ScheduledStatus: React.FC<IScheduledStatus> = ({ statusId, ...other }) => {
  const status = useAppSelector((state) => buildStatus(state, state.scheduled_statuses.get(statusId))) as StatusEntity;

  if (!status) return null;

  const account = status.account as AccountEntity;

  return (
    <div className={classNames('status__wrapper', `status__wrapper-${status.visibility}`, { 'status__wrapper-reply': !!status.in_reply_to_id })} tabIndex={0}>
      <div className={classNames('status', `status-${status.visibility}`, { 'status-reply': !!status.in_reply_to_id })} data-id={status.id}>
        <div className='mb-4'>
          <HStack justifyContent='between' alignItems='start'>
            <AccountContainer
              key={account.id}
              id={account.id}
              timestamp={status.created_at}
              futureTimestamp
            />
          </HStack>
        </div>

        <StatusReplyMentions status={status} />

        <StatusContent
          status={status}
          expanded
          collapsable
        />

        {status.media_attachments.size > 0 && (
          <AttachmentThumbs
            media={status.media_attachments}
            sensitive={status.sensitive}
          />
        )}

        {status.poll && <PollPreview pollId={status.poll as string} />}

        <ScheduledStatusActionBar status={status} {...other} />
      </div>
    </div>
  );
};

export default ScheduledStatus;
