import React, { useRef } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';

import Icon from 'soapbox/components/icon';
import StatusMedia from 'soapbox/components/status-media';
import StatusReplyMentions from 'soapbox/components/status-reply-mentions';
import StatusContent from 'soapbox/components/status_content';
import { HStack, Stack, Text, Button } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import { useAppSelector } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';
import { getActualStatus } from 'soapbox/utils/status';



import StatusInteractionBar from './status-interaction-bar';

import type { List as ImmutableList } from 'immutable';
import type { Attachment as AttachmentEntity, Status as StatusEntity } from 'soapbox/types/entities';

interface IDetailedStatus {
  status: StatusEntity,
  onOpenMedia: (media: ImmutableList<AttachmentEntity>, index: number) => void,
  onOpenVideo: (media: ImmutableList<AttachmentEntity>, start: number) => void,
  onToggleHidden: (status: StatusEntity) => void,
  onTranslate: (status: StatusEntity, language: string) => void,
  showMedia: boolean,
  onOpenCompareHistoryModal: (status: StatusEntity) => void,
  onToggleMediaVisibility: () => void,
}

const DetailedStatus: React.FC<IDetailedStatus> = ({
  status,
  onToggleHidden,
  onOpenCompareHistoryModal,
  onToggleMediaVisibility,
  onTranslate,
  showMedia,
}) => {
  const intl = useIntl();
  const node = useRef<HTMLDivElement>(null);
  const firstLanguage = useAppSelector((state) => state.instance.get('languages').get(0) || 'en');
  const features = useAppSelector((state) => getFeatures(state.instance));

  const handleExpandedToggle = () => {
    onToggleHidden(status);
  };

  const handleOpenCompareHistoryModal = () => {
    onOpenCompareHistoryModal(status);
  };

  const handleTranslateStatus = React.useCallback(() => {
    onTranslate(status, firstLanguage);
  }, [status, firstLanguage]);

  const actualStatus = getActualStatus(status);
  if (!actualStatus) return null;
  const { account } = actualStatus;
  if (!account || typeof account !== 'object') return null;

  let statusTypeIcon = null;

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
    statusTypeIcon = <Icon className='text-gray-700 dark:text-gray-600' src={require('@tabler/icons/mail.svg')} />;
  } else if (actualStatus.visibility === 'private') {
    statusTypeIcon = <Icon className='text-gray-700 dark:text-gray-600' src={require('@tabler/icons/lock.svg')} />;
  }


  return (
    <div className='border-box'>
      <div ref={node} className='detailed-actualStatus' tabIndex={-1}>
        <HStack className='mb-4' alignItems='center'>
          <div className='grow'>
            <AccountContainer
              key={account.id}
              id={account.id}
              timestamp={actualStatus.created_at}
              avatarSize={42}
              hideActions
            />
          </div>
          {
            features.translations && actualStatus.language !== firstLanguage && (
              <div>
                <Button theme='link'  onClick={handleTranslateStatus}>
                  <Icon src={require('@tabler/icons/language.svg')} />
                  <FormattedMessage id='actualStatuses.translate' defaultMessage='Translate' />
                </Button>
              </div>
            )
          }
        </HStack>

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

          <Stack space={1} className='items-end mb-3'>
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
          </Stack>
        </HStack>


      </div>
    </div>
  );
};

export default DetailedStatus;
