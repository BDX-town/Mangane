import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Avatar from './avatar';
import AvatarOverlay from './avatar_overlay';
import AvatarComposite from './avatar_composite';
import RelativeTimestamp from './relative_timestamp';
import DisplayName from './display_name';
import StatusContent from './status_content';
import StatusActionBar from './status_action_bar';
import AttachmentList from './attachment_list';
import Card from '../features/status/components/card';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { MediaGallery, Video, Audio } from '../features/ui/util/async-components';
import { HotKeys } from 'react-hotkeys';
import classNames from 'classnames';
import Icon from 'soapbox/components/icon';
import PollContainer from 'soapbox/containers/poll_container';
import { Link, NavLink } from 'react-router-dom';
import { getDomain } from 'soapbox/utils/accounts';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';

// We use the component (and not the container) since we do not want
// to use the progress bar to show download progress
import Bundle from '../features/ui/components/bundle';

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
    onDelete: PropTypes.func,
    onDirect: PropTypes.func,
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
    showThread: PropTypes.bool,
    getScrollPosition: PropTypes.func,
    updateScrollBottom: PropTypes.func,
    cacheMediaWidth: PropTypes.func,
    cachedMediaWidth: PropTypes.number,
    group: ImmutablePropTypes.map,
    displayMedia: PropTypes.string,
    tagLinks: PropTypes.bool,
    allowedEmoji: ImmutablePropTypes.list,
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

  render() {
    let media = null;
    let poll = null;
    let statusAvatar, prepend, rebloggedByText, reblogContent;

    const { intl, hidden, featured, otherAccounts, unread, showThread, group } = this.props;

    let { status, account, ...other } = this.props;

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
          <div className='status__wrapper status__wrapper--filtered focusable' tabIndex='0' ref={this.handleRef}>
            <FormattedMessage id='status.filtered' defaultMessage='Filtered' />
          </div>
        </HotKeys>
      );
    }

    if (featured) {
      prepend = (
        <div className='status__prepend'>
          <div className='status__prepend-icon-wrapper'><Icon id='thumb-tack' className='status__prepend-icon' fixedWidth /></div>
          <FormattedMessage id='status.pinned' defaultMessage='Pinned post' />
        </div>
      );
    } else if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      const display_name_html = { __html: status.getIn(['account', 'display_name_html']) };

      prepend = (
        <div className='status__prepend'>
          <div className='status__prepend-icon-wrapper'><Icon id='retweet' className='status__prepend-icon' fixedWidth /></div>
          <FormattedMessage
            id='status.reblogged_by' defaultMessage='{name} reposted' values={{
              name: <NavLink to={`/@${status.getIn(['account', 'acct'])}`} className='status__display-name muted'>
                <bdi>
                  <strong dangerouslySetInnerHTML={display_name_html} />
                </bdi>
              </NavLink>,
            }}
          />
        </div>
      );

      rebloggedByText = intl.formatMessage({ id: 'status.reblogged_by', defaultMessage: '{name} reposted' }, { name: status.getIn(['account', 'acct']) });

      account = status.get('account');
      reblogContent = status.get('contentHtml');
      status        = status.get('reblog');
    }

    if (status.get('poll')) {
      poll = <PollContainer pollId={status.get('poll')} />;
    }
    if (status.get('media_attachments').size > 0) {
      if (this.props.muted) {
        media = (
          <AttachmentList
            compact
            media={status.get('media_attachments')}
          />
        );
      } else if (status.getIn(['media_attachments', 0, 'type']) === 'video') {
        const video = status.getIn(['media_attachments', 0]);

        media = (
          <Bundle fetchComponent={Video} loading={this.renderLoadingVideoPlayer} >
            {Component => (
              <Component
                preview={video.get('preview_url')}
                blurhash={video.get('blurhash')}
                src={video.get('url')}
                alt={video.get('description')}
                aspectRatio={video.getIn(['meta', 'small', 'aspect'])}
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
      } else if (status.getIn(['media_attachments', 0, 'type']) === 'audio' && status.get('media_attachments').size === 1) {
        const audio = status.getIn(['media_attachments', 0]);

        media = (
          <Bundle fetchComponent={Audio} loading={this.renderLoadingAudioPlayer} >
            {Component => (
              <Component
                src={audio.get('url')}
                alt={audio.get('description')}
                inline
                sensitive={status.get('sensitive')}
                cacheWidth={this.props.cacheMediaWidth}
                visible={this.state.showMedia}
                onOpenAudio={this.handleOpenAudio}
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
    } else if (status.get('spoiler_text').length === 0 && status.get('card')) {
      media = (
        <Card
          onOpenMedia={this.props.onOpenMedia}
          card={status.get('card')}
          compact
          cacheWidth={this.props.cacheMediaWidth}
          defaultWidth={this.props.cachedMediaWidth}
        />
      );
    }

    if (otherAccounts && otherAccounts.size > 1) {
      statusAvatar = <AvatarComposite accounts={otherAccounts} size={48} />;
    } else if (account === undefined || account === null) {
      statusAvatar = <Avatar account={status.get('account')} size={48} />;
    } else {
      statusAvatar = <AvatarOverlay account={status.get('account')} friend={account} />;
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
    };

    const statusUrl = `/@${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`;
    const favicon = status.getIn(['account', 'pleroma', 'favicon']);
    const domain = getDomain(status.get('account'));

    return (
      <HotKeys handlers={handlers}>
        <div className={classNames('status__wrapper', `status__wrapper-${status.get('visibility')}`, { 'status__wrapper-reply': !!status.get('in_reply_to_id'), read: unread === false, focusable: !this.props.muted })} tabIndex={this.props.muted ? null : 0} data-featured={featured ? 'true' : null} aria-label={textForScreenReader(intl, status, rebloggedByText)} ref={this.handleRef}>
          {prepend}

          <div className={classNames('status', `status-${status.get('visibility')}`, { 'status-reply': !!status.get('in_reply_to_id'), muted: this.props.muted, read: unread === false })} data-id={status.get('id')}>
            <div className='status__expand' onClick={this.handleExpandClick} role='presentation' />
            <div className='status__info'>
              <NavLink to={statusUrl} className='status__relative-time'>
                <RelativeTimestamp timestamp={status.get('created_at')} />
              </NavLink>

              {favicon &&
                <div className='status__favicon'>
                  <Link to={`/timeline/${domain}`}>
                    <img src={favicon} alt='' title={domain} />
                  </Link>
                </div>}

              <div className='status__profile'>
                <div className='status__avatar'>
                  <HoverRefWrapper accountId={status.getIn(['account', 'id'])}>
                    <NavLink to={`/@${status.getIn(['account', 'acct'])}`} title={status.getIn(['account', 'acct'])}>
                      {statusAvatar}
                    </NavLink>
                  </HoverRefWrapper>
                </div>
                <NavLink to={`/@${status.getIn(['account', 'acct'])}`} title={status.getIn(['account', 'acct'])} className='status__display-name'>
                  <DisplayName account={status.get('account')} others={otherAccounts} />
                </NavLink>
              </div>
            </div>

            {!group && status.get('group') && (
              <div className='status__meta'>
                Posted in <NavLink to={`/groups/${status.getIn(['group', 'id'])}`}>{status.getIn(['group', 'title'])}</NavLink>
              </div>
            )}

            <StatusContent
              status={status}
              reblogContent={reblogContent}
              onClick={this.handleClick}
              expanded={!status.get('hidden')}
              onExpandedToggle={this.handleExpandedToggle}
              tagLinks={this.props.tagLinks}
              collapsable
            />

            {media}
            {poll}

            {showThread && status.get('in_reply_to_id') && status.get('in_reply_to_account_id') === status.getIn(['account', 'id']) && (
              <button className='status__content__read-more-button' onClick={this.handleClick}>
                <FormattedMessage id='status.show_thread' defaultMessage='Show thread' />
              </button>
            )}

            <StatusActionBar status={status} account={account} {...other} />
          </div>
        </div>
      </HotKeys>
    );
  }

}
