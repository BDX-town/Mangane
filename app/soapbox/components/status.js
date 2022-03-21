import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

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

export const textForScreenReader = (intl, status, rebloggedByText = false) => {
  const displayName = status.getIn(['account', 'display_name']);

  const values = [
    displayName.length === 0 ? status.getIn(['account', 'acct']).split('@')[0] : displayName,
    status.get('spoiler_text') && status.get('hidden') ? status.get('spoiler_text') : status.get('search_index').slice(status.get('spoiler_text').length),
    intl.formatDate(status.get('created_at'), { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    status.getIn(['account', 'acct']),
  ];

  if (rebloggedByText) {
    values.push(rebloggedByText);
  }

  return values.join(', ');
};

export const defaultMediaVisibility = (status, displayMedia) => {
  if (!status) {
    return undefined;
  }

  if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
    status = status.get('reblog');
  }

  return (displayMedia !== 'hide_all' && !status.get('sensitive') || displayMedia === 'show_all');
};

export default @injectIntl
class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
    otherAccounts: ImmutablePropTypes.list,
    onClick: PropTypes.func,
    onReply: PropTypes.func,
    onFavourite: PropTypes.func,
    onReblog: PropTypes.func,
    onQuote: PropTypes.func,
    onDelete: PropTypes.func,
    onDirect: PropTypes.func,
    onChat: PropTypes.func,
    onMention: PropTypes.func,
    onPin: PropTypes.func,
    onOpenMedia: PropTypes.func,
    onOpenVideo: PropTypes.func,
    onOpenAudio: PropTypes.func,
    onBlock: PropTypes.func,
    onEmbed: PropTypes.func,
    onHeightChange: PropTypes.func,
    onToggleHidden: PropTypes.func,
    onShowHoverProfileCard: PropTypes.func,
    muted: PropTypes.bool,
    hidden: PropTypes.bool,
    unread: PropTypes.bool,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
    getScrollPosition: PropTypes.func,
    updateScrollBottom: PropTypes.func,
    cacheMediaWidth: PropTypes.func,
    cachedMediaWidth: PropTypes.number,
    group: ImmutablePropTypes.map,
    displayMedia: PropTypes.string,
    allowedEmoji: ImmutablePropTypes.list,
    focusable: PropTypes.bool,
  };

  static defaultProps = {
    focusable: true,
  };

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'account',
    'muted',
    'hidden',
  ];

  state = {
    showMedia: defaultMediaVisibility(this.props.status, this.props.displayMedia),
    statusId: undefined,
    emojiSelectorFocused: false,
  };

  // Track height changes we know about to compensate scrolling
  componentDidMount() {
    this.didShowCard = !this.props.muted && !this.props.hidden && this.props.status && this.props.status.get('card');
  }

  getSnapshotBeforeUpdate() {
    if (this.props.getScrollPosition) {
      return this.props.getScrollPosition();
    } else {
      return null;
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.status && nextProps.status.get('id') !== prevState.statusId) {
      return {
        showMedia: defaultMediaVisibility(nextProps.status, nextProps.displayMedia),
        statusId: nextProps.status.get('id'),
      };
    } else {
      return null;
    }
  }

  // Compensate height changes
  componentDidUpdate(prevProps, prevState, snapshot) {
    const doShowCard  = !this.props.muted && !this.props.hidden && this.props.status && this.props.status.get('card');

    if (doShowCard && !this.didShowCard) {
      this.didShowCard = true;

      if (snapshot !== null && this.props.updateScrollBottom) {
        if (this.node && this.node.offsetTop < snapshot.top) {
          this.props.updateScrollBottom(snapshot.height - snapshot.top);
        }
      }
    }
  }

  componentWillUnmount() {
    // FIXME: Run this code only when a status is being deleted.
    //
    // if (this.node && this.props.getScrollPosition) {
    //   const position = this.props.getScrollPosition();
    //   if (position !== null && this.node.offsetTop < position.top) {
    //     requestAnimationFrame(() => {
    //       this.props.updateScrollBottom(position.height - position.top);
    //     });
    //   }
    // }
  }

  handleToggleMediaVisibility = () => {
    this.setState({ showMedia: !this.state.showMedia });
  }

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
      return;
    }

    if (!this.context.router) {
      return;
    }

    this.context.router.history.push(`/@${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`);
  }

  handleExpandClick = (e) => {
    if (e.button === 0) {
      if (!this.context.router) {
        return;
      }

      this.context.router.history.push(`/@${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`);
    }
  }

  handleExpandedToggle = () => {
    this.props.onToggleHidden(this._properStatus());
  };

  renderLoadingMediaGallery() {
    return <div className='media_gallery' style={{ height: '285px' }} />;
  }

  renderLoadingVideoPlayer() {
    return <div className='media-spoiler-video' style={{ height: '285px' }} />;
  }

  renderLoadingAudioPlayer() {
    return <div className='media-spoiler-audio' style={{ height: '285px' }} />;
  }

  handleOpenVideo = (media, startTime) => {
    this.props.onOpenVideo(media, startTime);
  }

  handleOpenAudio = (media, startTime) => {
    this.props.OnOpenAudio(media, startTime);
  }

  handleHotkeyOpenMedia = e => {
    const { onOpenMedia, onOpenVideo } = this.props;
    const status = this._properStatus();

    e.preventDefault();

    if (status.get('media_attachments').size > 0) {
      if (status.getIn(['media_attachments', 0, 'type']) === 'video') {
        onOpenVideo(status.getIn(['media_attachments', 0]), 0);
      } else {
        onOpenMedia(status.get('media_attachments'), 0);
      }
    }
  }

  handleHotkeyReply = e => {
    e.preventDefault();
    this.props.onReply(this._properStatus(), this.context.router.history);
  }

  handleHotkeyFavourite = () => {
    this.props.onFavourite(this._properStatus());
  }

  handleHotkeyBoost = e => {
    this.props.onReblog(this._properStatus(), e);
  }

  handleHotkeyMention = e => {
    e.preventDefault();
    this.props.onMention(this._properStatus().get('account'), this.context.router.history);
  }

  handleHotkeyOpen = () => {
    this.context.router.history.push(`/@${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`);
  }

  handleHotkeyOpenProfile = () => {
    this.context.router.history.push(`/@${this._properStatus().getIn(['account', 'acct'])}`);
  }

  handleHotkeyMoveUp = e => {
    this.props.onMoveUp(this.props.status.get('id'), e.target.getAttribute('data-featured'));
  }

  handleHotkeyMoveDown = e => {
    this.props.onMoveDown(this.props.status.get('id'), e.target.getAttribute('data-featured'));
  }

  handleHotkeyToggleHidden = () => {
    this.props.onToggleHidden(this._properStatus());
  }

  handleHotkeyToggleSensitive = () => {
    this.handleToggleMediaVisibility();
  }

  handleHotkeyReact = () => {
    this._expandEmojiSelector();
  }

  handleEmojiSelectorExpand = e => {
    if (e.key === 'Enter') {
      this._expandEmojiSelector();
    }
    e.preventDefault();
  }

  handleEmojiSelectorUnfocus = () => {
    this.setState({ emojiSelectorFocused: false });
  }

  _expandEmojiSelector = () => {
    this.setState({ emojiSelectorFocused: true });
    const firstEmoji = this.node.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
    firstEmoji.focus();
  };

  _properStatus() {
    const { status } = this.props;

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      return status.get('reblog');
    } else {
      return status;
    }
  }

  handleRef = c => {
    this.node = c;
  }

  setRef = c => {
    if (c) {
      this.setState({ mediaWrapperWidth: c.offsetWidth });
    }
  }

  render() {
    let media = null;
    const poll = null;
    let prepend, rebloggedByText, reblogContent, reblogElement, reblogElementMobile;

    const { intl, hidden, featured, unread, group } = this.props;

    // FIXME: why does this need to reassign status and account??
    let { status, account, ...other } = this.props; // eslint-disable-line prefer-const

    if (status === null) {
      return null;
    }

    if (hidden) {
      return (
        <div ref={this.handleRef}>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.get('content')}
        </div>
      );
    }

    if (status.get('filtered') || status.getIn(['reblog', 'filtered'])) {
      const minHandlers = this.props.muted ? {} : {
        moveUp: this.handleHotkeyMoveUp,
        moveDown: this.handleHotkeyMoveDown,
      };

      return (
        <HotKeys handlers={minHandlers}>
          <div className={classNames('status__wrapper', 'status__wrapper--filtered', { focusable: this.props.focusable })} tabIndex={this.props.focusable ? 0 : null} ref={this.handleRef}>
            <FormattedMessage id='status.filtered' defaultMessage='Filtered' />
          </div>
        </HotKeys>
      );
    }

    if (featured) {
      prepend = (
        <div className='pt-4 px-4'>
          <HStack alignItems='center' space={1}>
            <Icon src={require('@tabler/icons/icons/pinned.svg')} className='text-gray-600' />

            <Text size='sm' theme='muted' weight='medium'>
              <FormattedMessage id='status.pinned' defaultMessage='Pinned post' />
            </Text>
          </HStack>
        </div>
      );
    }

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      const displayNameHtml = { __html: status.getIn(['account', 'display_name_html']) };

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
                  <strong className='text-gray-800' dangerouslySetInnerHTML={displayNameHtml} />
                </bdi>,
              }}
            />
          </HStack>
        </NavLink>
      );

      reblogElementMobile = (
        <div className='pt-4 px-4 sm:hidden truncate'>
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
                    <strong className='text-gray-800' dangerouslySetInnerHTML={displayNameHtml} />
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
        name: status.getIn(['account', 'acct']),
      });

      account = status.get('account');
      reblogContent = status.get('contentHtml');
      status = status.get('reblog');
    }

    const size = status.get('media_attachments').size;

    if (size > 0) {
      if (this.props.muted) {
        media = (
          <AttachmentThumbs
            media={status.get('media_attachments')}
            onClick={this.handleClick}
            sensitive={status.get('sensitive')}
          />
        );
      } else if (size === 1 && status.getIn(['media_attachments', 0, 'type']) === 'video') {
        const video = status.getIn(['media_attachments', 0]);

        const external_id = (video.get('external_video_id'));
        if (external_id) {
          const { mediaWrapperWidth } = this.state;
          const height = mediaWrapperWidth / (video.getIn(['meta', 'original', 'width']) / video.getIn(['meta', 'original', 'height']));
          media = (
            <div className='status-card horizontal compact interactive status-card--video'>
              <div
                ref={this.setRef}
                className='status-card__image status-card-video'
                style={height ? { height } : {}}
              >
                <iframe
                  src={`https://rumble.com/embed/${external_id}/`}
                  frameBorder='0'
                  allowFullScreen
                  webkitallowfullscreen='true'
                  mozallowfullscreen='true'
                  title=''
                />
              </div>
            </div>
          );
        } else {
          media = (
            <Bundle fetchComponent={Video} loading={this.renderLoadingVideoPlayer} >
              {Component => (
                <Component
                  preview={video.get('preview_url')}
                  blurhash={video.get('blurhash')}
                  src={video.get('url')}
                  alt={video.get('description')}
                  aspectRatio={video.getIn(['meta', 'original', 'aspect'])}
                  width={this.props.cachedMediaWidth}
                  height={285}
                  inline
                  sensitive={status.get('sensitive')}
                  onOpenVideo={this.handleOpenVideo}
                  cacheWidth={this.props.cacheMediaWidth}
                  visible={this.state.showMedia}
                  onToggleVisibility={this.handleToggleMediaVisibility}
                />
              )}
            </Bundle>
          );
        }
      } else if (size === 1 && status.getIn(['media_attachments', 0, 'type']) === 'audio' && status.get('media_attachments').size === 1) {
        const attachment = status.getIn(['media_attachments', 0]);

        media = (
          <Bundle fetchComponent={Audio} loading={this.renderLoadingAudioPlayer} >
            {Component => (
              <Component
                src={attachment.get('url')}
                alt={attachment.get('description')}
                poster={attachment.get('preview_url') !== attachment.get('url') ? attachment.get('preview_url') : status.getIn(['account', 'avatar_static'])}
                backgroundColor={attachment.getIn(['meta', 'colors', 'background'])}
                foregroundColor={attachment.getIn(['meta', 'colors', 'foreground'])}
                accentColor={attachment.getIn(['meta', 'colors', 'accent'])}
                duration={attachment.getIn(['meta', 'original', 'duration'], 0)}
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
            {Component => (
              <Component
                media={status.get('media_attachments')}
                sensitive={status.get('sensitive')}
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
    } else if (status.get('spoiler_text').length === 0 && !status.get('quote') && status.get('card')) {
      media = (
        <Card
          onOpenMedia={this.props.onOpenMedia}
          card={status.get('card')}
          compact
          cacheWidth={this.props.cacheMediaWidth}
          defaultWidth={this.props.cachedMediaWidth}
        />
      );
    } else if (status.get('expectsCard', false)) {
      media = (
        <PlaceholderCard />
      );
    }

    let quote;

    if (status.get('quote')) {
      if (status.getIn(['pleroma', 'quote_visible'], true) === false) {
        quote = (
          <div className='quoted-status-tombstone'>
            <p><FormattedMessage id='statuses.quote_tombstone' defaultMessage='Post is unavailable.' /></p>
          </div>
        );
      } else {
        quote = <QuotedStatus statusId={status.get('quote')} />;
      }
    }

    const handlers = this.props.muted ? {} : {
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

    const statusUrl = `/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`;
    // const favicon = status.getIn(['account', 'pleroma', 'favicon']);
    // const domain = getDomain(status.get('account'));

    return (
      <HotKeys handlers={handlers}>
        <div
          className='status cursor-pointer'
          tabIndex={this.props.focusable && !this.props.muted ? 0 : null}
          data-featured={featured ? 'true' : null}
          aria-label={textForScreenReader(intl, status, rebloggedByText)}
          ref={this.handleRef}
          onClick={() => this.context.router.history.push(statusUrl)}
          role='link'
        >
          {prepend}
          {reblogElementMobile}

          <div
            className={classNames({
              'status__wrapper': true,
              [`status-${status.get('visibility')}`]: true,
              'status-reply': !!status.get('in_reply_to_id'),
              muted: this.props.muted,
              read: unread === false,
            })}
            data-id={status.get('id')}
          >
            <div className='mb-4'>
              <HStack justifyContent='between' alignItems='start'>
                <AccountContainer
                  key={status.getIn(['account', 'id'])}
                  id={status.getIn(['account', 'id'])}
                  timestamp={status.get('created_at')}
                  timestampUrl={statusUrl}
                  action={reblogElement}
                  hideActions={!reblogElement}
                />
              </HStack>
            </div>

            <div className='status__content-wrapper'>
              {!group && status.get('group') && (
                <div className='status__meta'>
                  Posted in <NavLink to={`/groups/${status.getIn(['group', 'id'])}`}>{status.getIn(['group', 'title'])}</NavLink>
                </div>
              )}

              <StatusReplyMentions status={this._properStatus()} />

              <StatusContent
                status={status}
                reblogContent={reblogContent}
                onClick={this.handleClick}
                expanded={!status.get('hidden')}
                onExpandedToggle={this.handleExpandedToggle}
                collapsable
              />

              {media}
              {poll}
              {quote}

              <StatusActionBar
                status={status}
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
