import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FormattedDate } from 'react-intl';
import { Link, NavLink } from 'react-router-dom';

import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import Icon from 'soapbox/components/icon';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import { getDomain } from 'soapbox/utils/accounts';

import Avatar from '../../../components/avatar';
import DisplayName from '../../../components/display_name';
import MediaGallery from '../../../components/media_gallery';
import StatusContent from '../../../components/status_content';
import StatusReplyMentions from '../../../components/status_reply_mentions';
import Audio from '../../audio';
import scheduleIdleTask from '../../ui/util/schedule_idle_task';
import Video from '../../video';

import Card from './card';
import StatusInteractionBar from './status_interaction_bar';

export default @injectIntl
class DetailedStatus extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    onOpenMedia: PropTypes.func.isRequired,
    onOpenVideo: PropTypes.func.isRequired,
    onToggleHidden: PropTypes.func.isRequired,
    measureHeight: PropTypes.bool,
    onHeightChange: PropTypes.func,
    domain: PropTypes.string,
    compact: PropTypes.bool,
    showMedia: PropTypes.bool,
    onToggleMediaVisibility: PropTypes.func,
  };

  state = {
    height: null,
  };

  handleOpenVideo = (media, startTime) => {
    this.props.onOpenVideo(media, startTime);
  }

  handleExpandedToggle = () => {
    this.props.onToggleHidden(this.props.status);
  }

  _measureHeight(heightJustChanged) {
    if (this.props.measureHeight && this.node) {
      scheduleIdleTask(() => this.node && this.setState({ height: Math.ceil(this.node.scrollHeight) + 1 }));

      if (this.props.onHeightChange && heightJustChanged) {
        this.props.onHeightChange();
      }
    }
  }

  setRef = c => {
    this.node = c;
    this._measureHeight();
  }

  componentDidUpdate(prevProps, prevState) {
    this._measureHeight(prevState.height !== this.state.height);
  }

  handleModalLink = e => {
    e.preventDefault();

    let href;

    if (e.target.nodeName !== 'A') {
      href = e.target.parentNode.href;
    } else {
      href = e.target.href;
    }

    window.open(href, 'soapbox-intent', 'width=445,height=600,resizable=no,menubar=no,status=no,scrollbars=yes');
  }


  render() {
    const status = (this.props.status && this.props.status.get('reblog')) ? this.props.status.get('reblog') : this.props.status;
    const outerStyle = { boxSizing: 'border-box' };
    const { compact } = this.props;
    const favicon = status.getIn(['account', 'pleroma', 'favicon']);
    const domain = getDomain(status.get('account'));
    const size = status.get('media_attachments').size;

    if (!status) {
      return null;
    }

    let media = null;
    let statusTypeIcon = null;

    if (this.props.measureHeight) {
      outerStyle.height = `${this.state.height}px`;
    }

    if (size > 0) {
      if (size === 1 && status.getIn(['media_attachments', 0, 'type']) === 'video') {
        const video = status.getIn(['media_attachments', 0]);

        media = (
          <Video
            preview={video.get('preview_url')}
            blurhash={video.get('blurhash')}
            src={video.get('url')}
            alt={video.get('description')}
            aspectRatio={video.getIn(['meta', 'original', 'aspect'])}
            width={300}
            height={150}
            inline
            onOpenVideo={this.handleOpenVideo}
            sensitive={status.get('sensitive')}
            visible={this.props.showMedia}
            onToggleVisibility={this.props.onToggleMediaVisibility}
          />
        );
      } else if (size === 1 && status.getIn(['media_attachments', 0, 'type']) === 'audio' && status.get('media_attachments').size === 1) {
        const attachment = status.getIn(['media_attachments', 0]);

        media = (
          <Audio
            src={attachment.get('url')}
            alt={attachment.get('description')}
            duration={attachment.getIn(['meta', 'original', 'duration'], 0)}
            poster={attachment.get('preview_url') !== attachment.get('url') ? attachment.get('preview_url') : status.getIn(['account', 'avatar_static'])}
            backgroundColor={attachment.getIn(['meta', 'colors', 'background'])}
            foregroundColor={attachment.getIn(['meta', 'colors', 'foreground'])}
            accentColor={attachment.getIn(['meta', 'colors', 'accent'])}
            height={150}
          />
        );
      } else {
        media = (
          <MediaGallery
            standalone
            sensitive={status.get('sensitive')}
            media={status.get('media_attachments')}
            height={300}
            onOpenMedia={this.props.onOpenMedia}
            visible={this.props.showMedia}
            onToggleVisibility={this.props.onToggleMediaVisibility}
          />
        );
      }
    } else if (status.get('spoiler_text').length === 0 && !status.get('quote')) {
      media = <Card onOpenMedia={this.props.onOpenMedia} card={status.get('card', null)} />;
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

    if (status.get('visibility') === 'direct') {
      statusTypeIcon = <Icon src={require('@tabler/icons/icons/mail.svg')} />;
    } else if (status.get('visibility') === 'private') {
      statusTypeIcon = <Icon src={require('@tabler/icons/icons/lock.svg')} />;
    }

    return (
      <div style={outerStyle}>
        <div ref={this.setRef} className={classNames('detailed-status', { compact })}>
          <div className='detailed-status__profile'>
            <div className='detailed-status__display-name'>
              <NavLink to={`/@${status.getIn(['account', 'acct'])}`}>
                <div className='detailed-status__display-avatar'>
                  <HoverRefWrapper accountId={status.getIn(['account', 'id'])}>
                    <Avatar account={status.get('account')} size={48} />
                  </HoverRefWrapper>
                </div>
              </NavLink>
              <DisplayName account={status.get('account')}>
                <HoverRefWrapper accountId={status.getIn(['account', 'id'])}>
                  <NavLink className='floating-link' to={`/@${status.getIn(['account', 'acct'])}`} title={status.getIn(['account', 'acct'])} />
                </HoverRefWrapper>
              </DisplayName>
            </div>
          </div>

          {status.get('group') && (
            <div className='status__meta'>
              Posted in <NavLink to={`/groups/${status.getIn(['group', 'id'])}`}>{status.getIn(['group', 'title'])}</NavLink>
            </div>
          )}

          <StatusReplyMentions status={status} />

          <StatusContent
            status={status}
            expanded={!status.get('hidden')}
            onExpandedToggle={this.handleExpandedToggle}
          />

          {media}
          {quote}

          <div className='detailed-status__meta'>
            <StatusInteractionBar status={status} />

            <div className='detailed-status__timestamp'>
              {favicon &&
                <div className='status__favicon'>
                  <Link to={`/timeline/${domain}`}>
                    <img src={favicon} alt='' title={domain} />
                  </Link>
                </div>}

              {statusTypeIcon}

              <a className='detailed-status__datetime' href={status.get('url')} target='_blank' rel='noopener'>
                <FormattedDate value={new Date(status.get('created_at'))} hour12={false} year='numeric' month='short' day='2-digit' hour='2-digit' minute='2-digit' />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
