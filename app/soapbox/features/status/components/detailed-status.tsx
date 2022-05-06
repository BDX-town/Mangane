import classNames from 'classnames';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl, WrappedComponentProps as IntlProps } from 'react-intl';
import { FormattedDate } from 'react-intl';

import Icon from 'soapbox/components/icon';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';

import MediaGallery from '../../../components/media_gallery';
import StatusContent from '../../../components/status_content';
import StatusReplyMentions from '../../../components/status_reply_mentions';
import { HStack, Text } from '../../../components/ui';
import AccountContainer from '../../../containers/account_container';
import Audio from '../../audio';
import scheduleIdleTask from '../../ui/util/schedule_idle_task';
import Video from '../../video';

import Card from './card';
import StatusInteractionBar from './status-interaction-bar';

import type { List as ImmutableList } from 'immutable';
import type { Attachment as AttachmentEntity, Status as StatusEntity } from 'soapbox/types/entities';

interface IDetailedStatus extends IntlProps {
  status: StatusEntity,
  onOpenMedia: (media: ImmutableList<AttachmentEntity>, index: number) => void,
  onOpenVideo: (media: ImmutableList<AttachmentEntity>, start: number) => void,
  onToggleHidden: (status: StatusEntity) => void,
  measureHeight: boolean,
  onHeightChange: () => void,
  domain: string,
  compact: boolean,
  showMedia: boolean,
  onOpenCompareHistoryModal: (status: StatusEntity) => void,
  onToggleMediaVisibility: () => void,
}

interface IDetailedStatusState {
  height: number | null,
  mediaWrapperWidth: number,
}

class DetailedStatus extends ImmutablePureComponent<IDetailedStatus, IDetailedStatusState> {

  state = {
    height: null,
    mediaWrapperWidth: NaN,
  };

  node: HTMLDivElement | null = null;

  handleOpenVideo = (media: ImmutableList<AttachmentEntity>, startTime: number) => {
    this.props.onOpenVideo(media, startTime);
  }

  handleExpandedToggle = () => {
    this.props.onToggleHidden(this.props.status);
  }

  handleOpenCompareHistoryModal = () => {
    this.props.onOpenCompareHistoryModal(this.props.status);
  }

  _measureHeight(heightJustChanged = false) {
    if (this.props.measureHeight && this.node) {
      scheduleIdleTask(() => this.node && this.setState({ height: Math.ceil(this.node.scrollHeight) + 1 }));

      if (this.props.onHeightChange && heightJustChanged) {
        this.props.onHeightChange();
      }
    }
  }

  setRef: React.RefCallback<HTMLDivElement> = c => {
    this.node = c;
    this._measureHeight();

    if (c) {
      this.setState({ mediaWrapperWidth: c.offsetWidth });
    }
  }

  componentDidUpdate(prevProps: IDetailedStatus, prevState: IDetailedStatusState) {
    this._measureHeight(prevState.height !== this.state.height);
  }

  // handleModalLink = e => {
  //   e.preventDefault();
  //
  //   let href;
  //
  //   if (e.target.nodeName !== 'A') {
  //     href = e.target.parentNode.href;
  //   } else {
  //     href = e.target.href;
  //   }
  //
  //   window.open(href, 'soapbox-intent', 'width=445,height=600,resizable=no,menubar=no,status=no,scrollbars=yes');
  // }

  getActualStatus = () => {
    const { status } = this.props;
    if (!status) return undefined;
    return status.reblog && typeof status.reblog === 'object' ? status.reblog : status;
  }

  render() {
    const status = this.getActualStatus();
    if (!status) return null;
    const { account } = status;
    if (!account || typeof account !== 'object') return null;

    const outerStyle: React.CSSProperties = { boxSizing: 'border-box' };
    const { compact } = this.props;

    let media = null;
    let statusTypeIcon = null;

    if (this.props.measureHeight) {
      outerStyle.height = `${this.state.height}px`;
    }

    const size = status.media_attachments.size;
    const firstAttachment = status.media_attachments.get(0);

    if (size > 0 && firstAttachment) {
      if (size === 1 && firstAttachment.type === 'video') {
        const video = firstAttachment;
        if (video.external_video_id && status.card?.html) {
          const { mediaWrapperWidth } = this.state;

          const getHeight = (): number => {
            const width = Number(video.meta.getIn(['original', 'width']));
            const height = Number(video.meta.getIn(['original', 'height']));
            return Number(mediaWrapperWidth) / (width / height);
          };

          const height = getHeight();

          media = (
            <div className='status-card horizontal interactive status-card--video'>
              <div
                ref={this.setRef}
                className='status-card-video'
                style={{ height }}
                dangerouslySetInnerHTML={{ __html: status.card.html }}
              />
            </div>
          );
        } else {
          media = (
            <Video
              preview={video.preview_url}
              blurhash={video.blurhash}
              src={video.url}
              alt={video.description}
              aspectRatio={video.meta.getIn(['original', 'aspect'])}
              width={300}
              height={150}
              inline
              onOpenVideo={this.handleOpenVideo}
              sensitive={status.sensitive}
              visible={this.props.showMedia}
              onToggleVisibility={this.props.onToggleMediaVisibility}
            />
          );
        }
      } else if (size === 1 && firstAttachment.type === 'audio') {
        const attachment = firstAttachment;

        media = (
          <Audio
            src={attachment.url}
            alt={attachment.description}
            duration={attachment.meta.getIn(['original', 'duration', 0])}
            poster={attachment.preview_url !== attachment.url ? attachment.preview_url : account.avatar_static}
            backgroundColor={attachment.meta.getIn(['colors', 'background'])}
            foregroundColor={attachment.meta.getIn(['colors', 'foreground'])}
            accentColor={attachment.meta.getIn(['colors', 'accent'])}
            height={150}
          />
        );
      } else {
        media = (
          <MediaGallery
            standalone
            sensitive={status.sensitive}
            media={status.media_attachments}
            height={300}
            onOpenMedia={this.props.onOpenMedia}
            visible={this.props.showMedia}
            onToggleVisibility={this.props.onToggleMediaVisibility}
          />
        );
      }
    } else if (status.spoiler_text.length === 0 && !status.quote && status.card) {
      media = <Card onOpenMedia={this.props.onOpenMedia} card={status.card} />;
    }

    let quote;

    if (status.quote) {
      if (status.pleroma.get('quote_visible', true) === false) {
        quote = (
          <div className='quoted-status-tombstone'>
            <p><FormattedMessage id='statuses.quote_tombstone' defaultMessage='Post is unavailable.' /></p>
          </div>
        );
      } else {
        quote = <QuotedStatus statusId={status.quote} />;
      }
    }

    if (status.visibility === 'direct') {
      statusTypeIcon = <Icon src={require('@tabler/icons/icons/mail.svg')} />;
    } else if (status.visibility === 'private') {
      statusTypeIcon = <Icon src={require('@tabler/icons/icons/lock.svg')} />;
    }

    return (
      <div style={outerStyle}>
        <div ref={this.setRef} className={classNames('detailed-status', { compact })}>
          <div className='mb-4'>
            <AccountContainer
              key={account.id}
              id={account.id}
              timestamp={status.created_at}
              avatarSize={42}
              hideActions
            />
          </div>

          {/* status.group && (
            <div className='status__meta'>
              Posted in <NavLink to={`/groups/${status.getIn(['group', 'id'])}`}>{status.getIn(['group', 'title'])}</NavLink>
            </div>
          )*/}

          <StatusReplyMentions status={status} />

          <StatusContent
            status={status}
            expanded={!status.hidden}
            onExpandedToggle={this.handleExpandedToggle}
          />

          {media}
          {quote}

          <HStack justifyContent='between' alignItems='center' className='py-2'>
            <StatusInteractionBar status={status} />


            <div className='detailed-status__timestamp'>
              {statusTypeIcon}

              <span>
                <a href={status.url} target='_blank' rel='noopener' className='hover:underline'>
                  <Text tag='span' theme='muted' size='sm'>
                    <FormattedDate value={new Date(status.created_at)} hour12={false} year='numeric' month='short' day='2-digit' hour='2-digit' minute='2-digit' />
                  </Text>
                </a>

                {status.edited_at && (
                  <>
                    {' · '}
                    <div
                      className='inline hover:underline'
                      onClick={this.handleOpenCompareHistoryModal}
                      role='button'
                      tabIndex={0}
                    >
                      <Text tag='span' theme='muted' size='sm'>
                        <FormattedMessage id='status.edited' defaultMessage='Edited {date}' values={{ date: this.props.intl.formatDate(new Date(status.edited_at), { hour12: false, month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }} />
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
  }

}

export default injectIntl(DetailedStatus);
