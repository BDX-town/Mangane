import React, { useRef } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';

import { getSettings } from 'soapbox/actions/settings';
import Icon from 'soapbox/components/icon';
import StatusMedia from 'soapbox/components/status-media';
import StatusReplyMentions from 'soapbox/components/status-reply-mentions';
import StatusContent from 'soapbox/components/status_content';
import { HStack, Stack, Text, Button } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import { useAppSelector, useOwnAccount, useLogo } from 'soapbox/hooks';
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
  const ownAccount = useOwnAccount();
  const locale = useAppSelector((state) => getSettings(state).get('locale')) as string;
  const localeTranslated = React.useMemo(() => (new Intl.DisplayNames([locale], { type: 'language' })).of(locale), [locale]);
  const features = useAppSelector((state) => getFeatures(state.instance));
  const logo = useLogo();

  const actualStatus = getActualStatus(status);
  const { account } = actualStatus;

  const canTranslate = React.useMemo(() =>
    ownAccount && features.translations && actualStatus.language !== locale
  , [ownAccount, features, actualStatus]);

  const handleExpandedToggle = () => {
    onToggleHidden(status);
  };

  const handleOpenCompareHistoryModal = () => {
    onOpenCompareHistoryModal(status);
  };

  const handleTranslateStatus = React.useCallback(() => {
    onTranslate(status, locale);
  }, [status, locale]);

  const privacyIcon = React.useMemo(() => {
    switch (actualStatus?.visibility) {
      default:
      case 'public': return require('@tabler/icons/world.svg');
      case 'unlisted': return require('@tabler/icons/eye-off.svg');
      case 'local': return logo;
      case 'private': return require('@tabler/icons/lock.svg');
      case 'direct': return require('@tabler/icons/mail.svg');
    }
  }, [actualStatus?.visibility]);

  if (!actualStatus) return null;
  if (!account || typeof account !== 'object') return null;



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



  return (
    <div className='border-box'>
      <div ref={node} className='detailed-actualStatus' tabIndex={-1}>
        <div className='mb-4 flex items-center justify-between gap-1'>
          {
            canTranslate ? (
              !actualStatus.translations.get(locale) ? (
                <Button theme='link' size='sm'  onClick={handleTranslateStatus}>
                  <Icon className='mr-1' src={require('@tabler/icons/language.svg')} />
                  <FormattedMessage id='actualStatuses.translate' defaultMessage='Translate' />
                </Button>
              ) : (
                <Text theme='subtle' className='flex items-center' size='xs'>
                  <Icon className='mr-1' src={require('@tabler/icons/check.svg')} />
                  <FormattedMessage id='actualStatuses.translated' defaultMessage='Translate' />
                </Text>
              )
            ) : (
              <Icon className='text-gray-300 dark:text-slate-500' src={require('@tabler/icons/note.svg')} />
            )
          }
          <Icon aria-hidden src={privacyIcon} className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-600' />
        </div>

        <div className='mb-3'>
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

        {
          actualStatus.translations.get(locale) && !actualStatus.hidden && (
            <>
              <hr className='my-3' />
              <Text className='mb-1' size='md' weight='medium'>
                <FormattedMessage
                  id='actualStatuses.translate_done'
                  defaultMessage='Status translated to {locale}'
                  values={{ locale: localeTranslated }}
                />
              </Text>
              <div
                className='status__content'
                lang={locale}
                dangerouslySetInnerHTML={{ __html: actualStatus.translations.get(locale) }}
              />
            </>
          )
        }

        <StatusMedia
          status={actualStatus}
          showMedia={showMedia}
          onToggleVisibility={onToggleMediaVisibility}
        />

        {!actualStatus.hidden && quote}

        <HStack justifyContent='between' alignItems='center' className='py-2'>
          <StatusInteractionBar status={actualStatus} />

          <Stack space={1} className='items-end mb-3'>
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
