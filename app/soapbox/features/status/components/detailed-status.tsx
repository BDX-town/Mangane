import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';

import Icon from 'soapbox/components/icon';
import StatusMedia from 'soapbox/components/status-media';
import StatusReplyMentions from 'soapbox/components/status-reply-mentions';
import StatusContent from 'soapbox/components/status_content';
import { HStack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import scheduleIdleTask from 'soapbox/features/ui/util/schedule_idle_task';

import StatusInteractionBar from './status-interaction-bar';

import type { List as ImmutableList } from 'immutable';
import type { Attachment as AttachmentEntity, Status as StatusEntity } from 'soapbox/types/entities';

interface IDetailedStatus {
  status: StatusEntity,
  onOpenMedia: (media: ImmutableList<AttachmentEntity>, index: number) => void,
  onOpenVideo: (media: ImmutableList<AttachmentEntity>, start: number) => void,
  onToggleHidden: (status: StatusEntity) => void,
  measureHeight: boolean,
  /** @deprecated Unused. */
  onHeightChange?: () => void,
  domain: string,
  compact: boolean,
  showMedia: boolean,
  onOpenCompareHistoryModal: (status: StatusEntity) => void,
  onToggleMediaVisibility: () => void,
}

const DetailedStatus: React.FC<IDetailedStatus> = ({
  status,
  onToggleHidden,
  onOpenCompareHistoryModal,
  onToggleMediaVisibility,
  measureHeight,
  showMedia,
  compact,
}) => {
  const intl = useIntl();

  const node = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  const handleExpandedToggle = () => {
    onToggleHidden(status);
  };

  const handleOpenCompareHistoryModal = () => {
    onOpenCompareHistoryModal(status);
  };

  useEffect(() => {
    if (measureHeight && node.current) {
      scheduleIdleTask(() => {
        if (node.current) {
          setHeight(Math.ceil(node.current.scrollHeight) + 1);
        }
      });
    }
  }, [node.current, height]);

  const getActualStatus = () => {
    if (!status) return undefined;
    return status.reblog && typeof status.reblog === 'object' ? status.reblog : status;
  };

  const actualStatus = getActualStatus();
  if (!actualStatus) return null;
  const { account } = actualStatus;
  if (!account || typeof account !== 'object') return null;

  const outerStyle: React.CSSProperties = { boxSizing: 'border-box' };

  let statusTypeIcon = null;

  if (measureHeight) {
    outerStyle.height = `${height}px`;
  }

  let quote;

  if (actualStatus.quote) {
    if (actualStatus.pleroma.get('quote_visible', true) === false) {
      quote = (
        <div className='quoted-actualStatus-tombstone'>
          <p><FormattedMessage id='actualStatuses.quote_tombstone' defaultMessage='Post is unavailable.' /></p>
        </div>
      );
    } else {
      quote = <QuotedStatus statusId={actualStatus.quote as string} />;
    }
  }

  if (actualStatus.visibility === 'direct') {
    statusTypeIcon = <Icon src={require('@tabler/icons/mail.svg')} />;
  } else if (actualStatus.visibility === 'private') {
    statusTypeIcon = <Icon src={require('@tabler/icons/lock.svg')} />;
  }

  return (
    <div style={outerStyle}>
      <div ref={node} className={classNames('detailed-actualStatus', { compact })} tabIndex={-1}>
        <div className='mb-4'>
          <AccountContainer
            key={account.id}
            id={account.id}
            timestamp={actualStatus.created_at}
            avatarSize={42}
            hideActions
          />
        </div>

        <StatusReplyMentions status={actualStatus} />

        <StatusContent
          status={actualStatus}
          expanded={!actualStatus.hidden}
          onExpandedToggle={handleExpandedToggle}
        />

        <StatusMedia
          status={actualStatus}
          showMedia={showMedia}
          onToggleVisibility={onToggleMediaVisibility}
        />

        {quote}

        <HStack justifyContent='between' alignItems='center' className='py-2'>
          <StatusInteractionBar status={actualStatus} />

          <div className='detailed-actualStatus__timestamp'>
            {statusTypeIcon}

            <span>
              <a href={actualStatus.url} target='_blank' rel='noopener' className='hover:underline'>
                <Text tag='span' theme='muted' size='sm'>
                  <FormattedDate value={new Date(actualStatus.created_at)} hour12={false} year='numeric' month='short' day='2-digit' hour='2-digit' minute='2-digit' />
                </Text>
              </a>

              {actualStatus.edited_at && (
                <>
                  {' · '}
                  <div
                    className='inline hover:underline'
                    onClick={handleOpenCompareHistoryModal}
                    role='button'
                    tabIndex={0}
                  >
                    <Text tag='span' theme='muted' size='sm'>
                      <FormattedMessage id='actualStatus.edited' defaultMessage='Edited {date}' values={{ date: intl.formatDate(new Date(actualStatus.edited_at), { hour12: false, month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }} />
                    </Text>
                  </div>
                </>
              )}
            </span>
          </div>
        </HStack>
      </div>
    </div>
  );
};

export default DetailedStatus;
