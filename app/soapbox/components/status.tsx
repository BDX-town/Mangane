import classNames from 'classnames';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, FormattedMessage, IntlShape } from 'react-intl';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';

import Icon from 'soapbox/components/icon';
import PlaceholderCard from 'soapbox/features/placeholder/components/placeholder_card';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';

import AccountContainer from '../containers/account_container';
import Card from '../features/status/components/card';
import Bundle from '../features/ui/components/bundle';
import { MediaGallery, Video, Audio } from '../features/ui/util/async-components';

import AttachmentThumbs from './attachment_thumbs';
import StatusActionBar from './status_action_bar';
import StatusContent from './status_content';
import StatusReplyMentions from './status_reply_mentions';
import { HStack, Text } from './ui';

import type { History } from 'history';
import type { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import type {
  Account as AccountEntity,
  Attachment as AttachmentEntity,
  Status as StatusEntity,
} from 'soapbox/types/entities';

// Defined in components/scrollable_list
export type ScrollPosition = { height: number, top: number };

export const textForScreenReader = (intl: IntlShape, status: StatusEntity, rebloggedByText?: string): string => {
  const { account } = status;
  if (!account || typeof account !== 'object') return '';

  const displayName = account.display_name;

  const values = [
    displayName.length === 0 ? account.acct.split('@')[0] : displayName,
    status.spoiler_text && status.hidden ? status.spoiler_text : status.search_index.slice(status.spoiler_text.length),
    intl.formatDate(status.created_at, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    status.getIn(['account', 'acct']),
  ];

  if (rebloggedByText) {
    values.push(rebloggedByText);
  }

  return values.join(', ');
};

export const defaultMediaVisibility = (status: StatusEntity, displayMedia: string): boolean => {
  if (!status) return false;

  if (status.reblog && typeof status.reblog === 'object') {
    status = status.reblog;
  }

  return (displayMedia !== 'hide_all' && !status.sensitive || displayMedia === 'show_all');
};

interface IStatus extends RouteComponentProps {
  intl: IntlShape,
  status: StatusEntity,
  account: AccountEntity,
  otherAccounts: ImmutableList<AccountEntity>,
  onClick: () => void,
  onReply: (status: StatusEntity, history: History) => void,
  onFavourite: (status: StatusEntity) => void,
  onReblog: (status: StatusEntity, e?: KeyboardEvent) => void,
  onQuote: (status: StatusEntity) => void,
  onDelete: (status: StatusEntity) => void,
  onEdit: (status: StatusEntity) => void,
  onDirect: (status: StatusEntity) => void,
  onChat: (status: StatusEntity) => void,
  onMention: (account: StatusEntity['account'], history: History) => void,
  onPin: (status: StatusEntity) => void,
  onOpenMedia: (media: ImmutableList<AttachmentEntity>, index: number) => void,
  onOpenVideo: (media: ImmutableMap<string, any> | AttachmentEntity, startTime: number) => void,
  onOpenAudio: (media: ImmutableMap<string, any>, startTime: number) => void,
  onBlock: (status: StatusEntity) => void,
  onEmbed: (status: StatusEntity) => void,
  onHeightChange: (status: StatusEntity) => void,
  onToggleHidden: (status: StatusEntity) => void,
  onShowHoverProfileCard: (status: StatusEntity) => void,
  muted: boolean,
  hidden: boolean,
  unread: boolean,
  onMoveUp: (statusId: string, featured?: string) => void,
  onMoveDown: (statusId: string, featured?: string) => void,
  getScrollPosition?: () => ScrollPosition | undefined,
  updateScrollBottom?: (bottom: number) => void,
  cacheMediaWidth: () => void,
  cachedMediaWidth: number,
  group: ImmutableMap<string, any>,
  displayMedia: string,
  allowedEmoji: ImmutableList<string>,
  focusable: boolean,
  history: History,
  featured?: string,
}

interface IStatusState {
  showMedia: boolean,
  statusId?: string,
  emojiSelectorFocused: boolean,
  mediaWrapperWidth?: number,
}

class Status extends ImmutablePureComponent<IStatus, IStatusState> {

  static defaultProps = {
    focusable: true,
  };

  didShowCard = false;
  node?: HTMLDivElement = undefined;
  height?: number = undefined;

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps: any[] = [
    'status',
    'account',
    'muted',
    'hidden',
  ];

  state: IStatusState = {
    showMedia: defaultMediaVisibility(this.props.status, this.props.displayMedia),
    statusId: undefined,
    emojiSelectorFocused: false,
  };

  // Track height changes we know about to compensate scrolling
  componentDidMount(): void {
    this.didShowCard = Boolean(!this.props.muted && !this.props.hidden && this.props.status && this.props.status.card);
  }

  getSnapshotBeforeUpdate(): ScrollPosition | undefined {
    if (this.props.getScrollPosition) {
      return this.props.getScrollPosition();
    } else {
      return undefined;
    }
  }

  static getDerivedStateFromProps(nextProps: IStatus, prevState: IStatusState) {
    if (nextProps.status && nextProps.status.id !== prevState.statusId) {
      return {
        showMedia: defaultMediaVisibility(nextProps.status, nextProps.displayMedia),
        statusId: nextProps.status.id,
      };
    } else {
      return null;
    }
  }

  // Compensate height changes
  componentDidUpdate(_prevProps: IStatus, _prevState: IStatusState, snapshot?: ScrollPosition): void {
    const doShowCard: boolean  = Boolean(!this.props.muted && !this.props.hidden && this.props.status && this.props.status.card);

    if (doShowCard && !this.didShowCard) {
      this.didShowCard = true;

      if (snapshot && this.props.updateScrollBottom) {
        if (this.node && this.node.offsetTop < snapshot.top) {
          this.props.updateScrollBottom(snapshot.height - snapshot.top);
        }
      }
    }
  }

  componentWillUnmount(): void {
    // FIXME: Run this code only when a status is being deleted.
    //
    // const { getScrollPosition, updateScrollBottom } = this.props;
    //
    // if (this.node && getScrollPosition && updateScrollBottom) {
    //   const position = getScrollPosition();
    //   if (position && this.node.offsetTop < position.top) {
    //     requestAnimationFrame(() => {
    //       updateScrollBottom(position.height - position.top);
    //     });
    //   }
    // }
  }

  handleToggleMediaVisibility = (): void => {
    this.setState({ showMedia: !this.state.showMedia });
  }

  handleClick = (): void => {
    if (this.props.onClick) {
      this.props.onClick();
      return;
    }

    if (!this.props.history) {
      return;
    }

    this.props.history.push(`/@${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().id}`);
  }

  handleExpandClick: React.EventHandler<React.MouseEvent> = (e) => {
    if (e.button === 0) {
      if (!this.props.history) {
        return;
      }

      this.props.history.push(`/@${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().id}`);
    }
  }

  handleExpandedToggle = (): void => {
    this.props.onToggleHidden(this._properStatus());
  };

  renderLoadingMediaGallery(): JSX.Element {
    return <div className='media_gallery' style={{ height: '285px' }} />;
  }

  renderLoadingVideoPlayer(): JSX.Element {
    return <div className='media-spoiler-video' style={{ height: '285px' }} />;
  }

  renderLoadingAudioPlayer(): JSX.Element {
    return <div className='media-spoiler-audio' style={{ height: '285px' }} />;
  }

  handleOpenVideo = (media: ImmutableMap<string, any>, startTime: number): void => {
    this.props.onOpenVideo(media, startTime);
  }

  handleOpenAudio = (media: ImmutableMap<string, any>, startTime: number): void => {
    this.props.onOpenAudio(media, startTime);
  }

  handleHotkeyOpenMedia = (e?: KeyboardEvent): void => {
    const { onOpenMedia, onOpenVideo } = this.props;
    const status = this._properStatus();
    const firstAttachment = status.media_attachments.first();

    e?.preventDefault();

    if (firstAttachment) {
      if (firstAttachment.type === 'video') {
        onOpenVideo(firstAttachment, 0);
      } else {
        onOpenMedia(status.media_attachments, 0);
      }
    }
  }

  handleHotkeyReply = (e?: KeyboardEvent): void => {
    e?.preventDefault();
    this.props.onReply(this._properStatus(), this.props.history);
  }

  handleHotkeyFavourite = (): void => {
    this.props.onFavourite(this._properStatus());
  }

  handleHotkeyBoost = (e?: KeyboardEvent): void => {
    this.props.onReblog(this._properStatus(), e);
  }

  handleHotkeyMention = (e?: KeyboardEvent): void => {
    e?.preventDefault();
    this.props.onMention(this._properStatus().account, this.props.history);
  }

  handleHotkeyOpen = (): void => {
    this.props.history.push(`/@${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().id}`);
  }

  handleHotkeyOpenProfile = (): void => {
    this.props.history.push(`/@${this._properStatus().getIn(['account', 'acct'])}`);
  }

  handleHotkeyMoveUp = (e?: KeyboardEvent): void => {
    // FIXME: what's going on here?
    // this.props.onMoveUp(this.props.status.id, e?.target?.getAttribute('data-featured'));
  }

  handleHotkeyMoveDown = (e?: KeyboardEvent): void => {
    // FIXME: what's going on here?
    // this.props.onMoveDown(this.props.status.id, e?.target?.getAttribute('data-featured'));
  }

  handleHotkeyToggleHidden = (): void => {
    this.props.onToggleHidden(this._properStatus());
  }

  handleHotkeyToggleSensitive = (): void => {
    this.handleToggleMediaVisibility();
  }

  handleHotkeyReact = (): void => {
    this._expandEmojiSelector();
  }

  handleEmojiSelectorExpand: React.EventHandler<React.KeyboardEvent> = e => {
    if (e.key === 'Enter') {
      this._expandEmojiSelector();
    }
    e.preventDefault();
  }

  handleEmojiSelectorUnfocus = (): void => {
    this.setState({ emojiSelectorFocused: false });
  }

  _expandEmojiSelector = (): void => {
    this.setState({ emojiSelectorFocused: true });
    const firstEmoji: HTMLDivElement | null | undefined = this.node?.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
    firstEmoji?.focus();
  };

  _properStatus(): StatusEntity {
    const { status } = this.props;

    if (status.reblog && typeof status.reblog === 'object') {
      return status.reblog;
    } else {
      return status;
    }
  }

  handleRef = (c: HTMLDivElement): void => {
    this.node = c;
  }

  setRef = (c: HTMLDivElement): void => {
    if (c) {
      this.setState({ mediaWrapperWidth: c.offsetWidth });
    }
  }

  render() {
    let media = null;
    const poll = null;
    let prepend, rebloggedByText, reblogElement, reblogElementMobile;

    const { intl, hidden, featured, unread, group } = this.props;

    // FIXME: why does this need to reassign status and account??
    let { status, account, ...other } = this.props; // eslint-disable-line prefer-const

    if (!status) return null;

    if (hidden) {
      return (
        <div ref={this.handleRef}>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.content}
        </div>
      );
    }

    if (status.filtered || status.getIn(['reblog', 'filtered'])) {
      const minHandlers = this.props.muted ? undefined : {
        moveUp: this.handleHotkeyMoveUp,
        moveDown: this.handleHotkeyMoveDown,
      };

      return (
        <HotKeys handlers={minHandlers}>
          <div className={classNames('status__wrapper', 'status__wrapper--filtered', { focusable: this.props.focusable })} tabIndex={this.props.focusable ? 0 : undefined} ref={this.handleRef}>
            <FormattedMessage id='status.filtered' defaultMessage='Filtered' />
          </div>
        </HotKeys>
      );
    }

    if (featured) {
      prepend = (
        <div className='pt-4 px-4'>
          <HStack alignItems='center' space={1}>
            <Icon src={require('@tabler/icons/icons/pinned.svg')} className='text-gray-600 dark:text-gray-400' />

            <Text size='sm' theme='muted' weight='medium'>
              <FormattedMessage id='status.pinned' defaultMessage='Pinned post' />
            </Text>
          </HStack>
        </div>
      );
    }

    if (status.reblog && typeof status.reblog === 'object') {
      const displayNameHtml = { __html: String(status.getIn(['account', 'display_name_html'])) };

      reblogElement = (
        <NavLink
          to={`/@${status.getIn(['account', 'acct'])}`}
          onClick={(event) => event.stopPropagation()}
          className='hidden sm:flex items-center text-gray-500 text-xs font-medium space-x-1 hover:underline'
        >
          <Icon src={require('@tabler/icons/icons/repeat.svg')} className='text-green-600' />

          <HStack alignItems='center'>
            <FormattedMessage
              id='status.reblogged_by'
              defaultMessage='{name} reposted'
              values={{
                name: <bdi className='max-w-[100px] truncate pr-1'>
                  <strong className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={displayNameHtml} />
                </bdi>,
              }}
            />
          </HStack>
        </NavLink>
      );

      reblogElementMobile = (
        <div className='pb-5 -mt-2 sm:hidden truncate'>
          <NavLink
            to={`/@${status.getIn(['account', 'acct'])}`}
            onClick={(event) => event.stopPropagation()}
            className='flex items-center text-gray-500 text-xs font-medium space-x-1 hover:underline'
          >
            <Icon src={require('@tabler/icons/icons/repeat.svg')} className='text-green-600' />

            <span>
              <FormattedMessage
                id='status.reblogged_by'
                defaultMessage='{name} reposted'
                values={{
                  name: <bdi>
                    <strong className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={displayNameHtml} />
                  </bdi>,
                }}
              />
            </span>
          </NavLink>
        </div>
      );

      rebloggedByText = intl.formatMessage({
        id: 'status.reblogged_by',
        defaultMessage: '{name} reposted',
      }, {
        name: String(status.getIn(['account', 'acct'])),
      });

      // @ts-ignore what the FUCK
      account = status.account;
      status = status.reblog;
    }

    const size = status.media_attachments.size;
    const firstAttachment = status.media_attachments.first();

    if (size > 0 && firstAttachment) {
      if (this.props.muted) {
        media = (
          <AttachmentThumbs
            media={status.media_attachments}
            onClick={this.handleClick}
            sensitive={status.sensitive}
          />
        );
      } else if (size === 1 && firstAttachment.type === 'video') {
        const video = firstAttachment;

        if (video.external_video_id && status.card) {
          const { mediaWrapperWidth } = this.state;

          const getHeight = (): number => {
            const width = Number(video.meta.getIn(['original', 'width']));
            const height = Number(video.meta.getIn(['original', 'height']));
            return Number(mediaWrapperWidth) / (width / height);
          };

          const height = getHeight();

          media = (
            <div className='status-card horizontal compact interactive status-card--video'>
              <div
                ref={this.setRef}
                className='status-card__image status-card-video'
                style={height ? { height } : undefined}
                dangerouslySetInnerHTML={{ __html: status.card.html }}
              />
            </div>
          );
        } else {
          media = (
            <Bundle fetchComponent={Video} loading={this.renderLoadingVideoPlayer} >
              {(Component: any) => (
                <Component
                  preview={video.preview_url}
                  blurhash={video.blurhash}
                  src={video.url}
                  alt={video.description}
                  aspectRatio={video.meta.getIn(['original', 'aspect'])}
                  width={this.props.cachedMediaWidth}
                  height={285}
                  inline
                  sensitive={status.sensitive}
                  onOpenVideo={this.handleOpenVideo}
                  cacheWidth={this.props.cacheMediaWidth}
                  visible={this.state.showMedia}
                  onToggleVisibility={this.handleToggleMediaVisibility}
                />
              )}
            </Bundle>
          );
        }
      } else if (size === 1 && firstAttachment.type === 'audio') {
        const attachment = firstAttachment;

        media = (
          <Bundle fetchComponent={Audio} loading={this.renderLoadingAudioPlayer} >
            {(Component: any) => (
              <Component
                src={attachment.url}
                alt={attachment.description}
                poster={attachment.preview_url !== attachment.url ? attachment.preview_url : status.getIn(['account', 'avatar_static'])}
                backgroundColor={attachment.meta.getIn(['colors', 'background'])}
                foregroundColor={attachment.meta.getIn(['colors', 'foreground'])}
                accentColor={attachment.meta.getIn(['colors', 'accent'])}
                duration={attachment.meta.getIn(['original', 'duration'], 0)}
                width={this.props.cachedMediaWidth}
                height={263}
                cacheWidth={this.props.cacheMediaWidth}
              />
            )}
          </Bundle>
        );
      } else {
        media = (
          <Bundle fetchComponent={MediaGallery} loading={this.renderLoadingMediaGallery}>
            {(Component: any) => (
              <Component
                media={status.media_attachments}
                sensitive={status.sensitive}
                height={285}
                onOpenMedia={this.props.onOpenMedia}
                cacheWidth={this.props.cacheMediaWidth}
                defaultWidth={this.props.cachedMediaWidth}
                visible={this.state.showMedia}
                onToggleVisibility={this.handleToggleMediaVisibility}
              />
            )}
          </Bundle>
        );
      }
    } else if (status.spoiler_text.length === 0 && !status.quote && status.card) {
      media = (
        <Card
          onOpenMedia={this.props.onOpenMedia}
          card={status.card}
          compact
          cacheWidth={this.props.cacheMediaWidth}
          defaultWidth={this.props.cachedMediaWidth}
        />
      );
    } else if (status.expectsCard) {
      media = (
        <PlaceholderCard />
      );
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

    const handlers = this.props.muted ? undefined : {
      reply: this.handleHotkeyReply,
      favourite: this.handleHotkeyFavourite,
      boost: this.handleHotkeyBoost,
      mention: this.handleHotkeyMention,
      open: this.handleHotkeyOpen,
      openProfile: this.handleHotkeyOpenProfile,
      moveUp: this.handleHotkeyMoveUp,
      moveDown: this.handleHotkeyMoveDown,
      toggleHidden: this.handleHotkeyToggleHidden,
      toggleSensitive: this.handleHotkeyToggleSensitive,
      openMedia: this.handleHotkeyOpenMedia,
      react: this.handleHotkeyReact,
    };

    const statusUrl = `/@${status.getIn(['account', 'acct'])}/posts/${status.id}`;
    // const favicon = status.getIn(['account', 'pleroma', 'favicon']);
    // const domain = getDomain(status.account);

    return (
      <HotKeys handlers={handlers} data-testid='status'>
        <div
          className='status cursor-pointer'
          tabIndex={this.props.focusable && !this.props.muted ? 0 : undefined}
          data-featured={featured ? 'true' : null}
          aria-label={textForScreenReader(intl, status, rebloggedByText)}
          ref={this.handleRef}
          onClick={() => this.props.history.push(statusUrl)}
          role='link'
        >
          {prepend}

          <div
            className={classNames({
              'status__wrapper': true,
              [`status-${status.visibility}`]: true,
              'status-reply': !!status.in_reply_to_id,
              muted: this.props.muted,
              read: unread === false,
            })}
            data-id={status.id}
          >
            {reblogElementMobile}

            <div className='mb-4'>
              <HStack justifyContent='between' alignItems='start'>
                <AccountContainer
                  key={String(status.getIn(['account', 'id']))}
                  id={String(status.getIn(['account', 'id']))}
                  timestamp={status.created_at}
                  timestampUrl={statusUrl}
                  action={reblogElement}
                  hideActions={!reblogElement}
                  showEdit={!!status.edited_at}
                />
              </HStack>
            </div>

            <div className='status__content-wrapper'>
              {!group && status.group && (
                <div className='status__meta'>
                  Posted in <NavLink to={`/groups/${status.getIn(['group', 'id'])}`}>{String(status.getIn(['group', 'title']))}</NavLink>
                </div>
              )}

              <StatusReplyMentions status={this._properStatus()} />

              <StatusContent
                status={status}
                onClick={this.handleClick}
                expanded={!status.hidden}
                onExpandedToggle={this.handleExpandedToggle}
                collapsable
              />

              {media}
              {poll}
              {quote}

              <StatusActionBar
                status={status}
                // @ts-ignore what?
                account={account}
                emojiSelectorFocused={this.state.emojiSelectorFocused}
                handleEmojiSelectorUnfocus={this.handleEmojiSelectorUnfocus}
                {...other}
              />
            </div>
          </div>
        </div>
      </HotKeys>
    );
  }

}

export default withRouter(injectIntl(Status));
