import classNames from 'classnames';
import React from 'react';

import StatusReplyMentions from 'soapbox/components/status-reply-mentions';
import StatusContent from 'soapbox/components/status_content';
import { HStack } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import PlaceholderCard from 'soapbox/features/placeholder/components/placeholder_card';
import PlaceholderMediaGallery from 'soapbox/features/placeholder/components/placeholder_media_gallery';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import { useAppSelector } from 'soapbox/hooks';

import { buildStatus } from '../util/pending_status_builder';

import PollPreview from './poll_preview';

import type { Account as AccountEntity, Status as StatusEntity } from 'soapbox/types/entities';

const shouldHaveCard = (pendingStatus: StatusEntity) => {
  return Boolean(pendingStatus.content.match(/https?:\/\/\S*/));
};

interface IPendingStatus {
  className?: string,
  idempotencyKey: string,
  muted?: boolean,
}

interface IPendingStatusMedia {
  status: StatusEntity,
}

const PendingStatusMedia: React.FC<IPendingStatusMedia> = ({ status }) => {
  if (status.media_attachments && !status.media_attachments.isEmpty()) {
    return (
      <PlaceholderMediaGallery
        media={status.media_attachments}
      />
    );
  } else if (!status.quote && shouldHaveCard(status)) {
    return <PlaceholderCard />;
  } else {
    return null;
  }
};

const PendingStatus: React.FC<IPendingStatus> = ({ idempotencyKey, className, muted }) => {
  const status = useAppSelector((state) => {
    const pendingStatus = state.pending_statuses.get(idempotencyKey);
    return pendingStatus ? buildStatus(state, pendingStatus, idempotencyKey) : null;
  }) as StatusEntity | null;

  if (!status) return null;
  if (!status.account) return null;

  const account = status.account as AccountEntity;

  return (
    <div className={classNames('opacity-50', className)}>
      <div className={classNames('status', { 'status-reply': !!status.in_reply_to_id, muted })} data-id={status.id}>
        <div className={classNames('status__wrapper', `status-${status.visibility}`, { 'status-reply': !!status.in_reply_to_id })} tabIndex={muted ? undefined : 0}>
          <div className='mb-4'>
            <HStack justifyContent='between' alignItems='start'>
              <AccountContainer
                key={account.id}
                id={account.id}
                timestamp={status.created_at}
                hideActions
              />
            </HStack>
          </div>

          <div className='status__content-wrapper'>
            <StatusReplyMentions status={status} />

            <StatusContent
              status={status}
              expanded
              collapsable
            />

            <PendingStatusMedia status={status} />

            {status.poll && <PollPreview pollId={status.poll as string} />}

            {status.quote && <QuotedStatus statusId={status.quote as string} />}
          </div>

          {/* TODO */}
          {/* <PlaceholderActionBar /> */}
        </div>
      </div>
    </div>
  );
};

export default PendingStatus;
