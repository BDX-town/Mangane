import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactSwipeableViews from 'react-swipeable-views';

import ExtendedVideoPlayer from 'soapbox/components/extended_video_player';
import Icon from 'soapbox/components/icon';
import IconButton from 'soapbox/components/icon_button';
import Audio from 'soapbox/features/audio';
import Video from 'soapbox/features/video';

import ImageLoader from './image_loader';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  previous: { id: 'lightbox.previous', defaultMessage: 'Previous' },
  next: { id: 'lightbox.next', defaultMessage: 'Next' },
});

export default @injectIntl @withRouter
class MediaModal extends ImmutablePureComponent {

  static propTypes = {
    media: ImmutablePropTypes.list.isRequired,
    status: ImmutablePropTypes.record,
    account: ImmutablePropTypes.record,
    index: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object,
  };

  state = {
    index: null,
    navigationHidden: false,
  };

  handleSwipe = (index) => {
    this.setState({ index: index % this.props.media.size });
  }

  handleNextClick = () => {
    this.setState({ index: (this.getIndex() + 1) % this.props.media.size });
  }

  handlePrevClick = () => {
    this.setState({ index: (this.props.media.size + this.getIndex() - 1) % this.props.media.size });
  }

  handleChangeIndex = (e) => {
    const index = Number(e.currentTarget.getAttribute('data-index'));
    this.setState({ index: index % this.props.media.size });
  }

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        this.handlePrevClick();
        e.preventDefault();
        e.stopPropagation();
        break;
      case 'ArrowRight':
        this.handleNextClick();
        e.preventDefault();
        e.stopPropagation();
        break;
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  getIndex() {
    return this.state.index !== null ? this.state.index : this.props.index;
  }

  toggleNavigation = () => {
    this.setState(prevState => ({
      navigationHidden: !prevState.navigationHidden,
    }));
  };

  handleStatusClick = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const { status, account } = this.props;
      const acct = account.get('acct');
      const statusId = status.get('id');
      this.props.history.push(`/@${acct}/posts/${statusId}`);
      this.props.onClose(null, true);
    }
  }

  handleCloserClick = ({ target }) => {
    const whitelist = ['zoomable-image'];
    const activeSlide = document.querySelector('.media-modal .react-swipeable-view-container > div[aria-hidden="false"]');

    const isClickOutside = target === activeSlide || !activeSlide.contains(target);
    const isWhitelisted = whitelist.some(w => target.classList.contains(w));

    if (isClickOutside || isWhitelisted) {
      this.props.onClose();
    }
  }

  render() {
    const { media, status, account, intl, onClose } = this.props;
    const { navigationHidden } = this.state;

    const index = this.getIndex();
    let pagination = [];

    const leftNav  = media.size > 1 && (
      <button tabIndex='0' className='media-modal__nav media-modal__nav--left' onClick={this.handlePrevClick} aria-label={intl.formatMessage(messages.previous)}>
        <Icon src={require('@tabler/icons/icons/arrow-left.svg')} />
      </button>
    );

    const rightNav = media.size > 1 && (
      <button tabIndex='0' className='media-modal__nav  media-modal__nav--right' onClick={this.handleNextClick} aria-label={intl.formatMessage(messages.next)}>
        <Icon src={require('@tabler/icons/icons/arrow-right.svg')} />
      </button>
    );

    if (media.size > 1) {
      pagination = media.map((item, i) => {
        const classes = ['media-modal__button'];
        if (i === index) {
          classes.push('media-modal__button--active');
        }
        return (<li className='media-modal__page-dot' key={i}><button tabIndex='0' className={classes.join(' ')} onClick={this.handleChangeIndex} data-index={i}>{i + 1}</button></li>);
      });
    }

    const isMultiMedia = media.map((image) => {
      if (image.get('type') !== 'image') {
        return true;
      }

      return false;
    }).toArray();

    const content = media.map(attachment => {
      const width  = attachment.getIn(['meta', 'original', 'width']) || null;
      const height = attachment.getIn(['meta', 'original', 'height']) || null;
      const link = (status && account && <a href={status.get('url')} onClick={this.handleStatusClick}><FormattedMessage id='lightbox.view_context' defaultMessage='View context' /></a>);

      if (attachment.get('type') === 'image') {
        return (
          <ImageLoader
            previewSrc={attachment.get('preview_url')}
            src={attachment.get('url')}
            width={width}
            height={height}
            alt={attachment.get('description')}
            key={attachment.get('url')}
            onClick={this.toggleNavigation}
          />
        );
      } else if (attachment.get('type') === 'video') {
        const { time } = this.props;

        return (
          <Video
            preview={attachment.get('preview_url')}
            blurhash={attachment.get('blurhash')}
            src={attachment.get('url')}
            width={attachment.get('width')}
            height={attachment.get('height')}
            startTime={time || 0}
            onCloseVideo={onClose}
            detailed
            link={link}
            alt={attachment.get('description')}
            key={attachment.get('url')}
          />
        );
      } else if (attachment.get('type') === 'audio') {
        return (
          <Audio
            src={attachment.get('url')}
            alt={attachment.get('description')}
            poster={attachment.get('preview_url') !== attachment.get('url') ? attachment.get('preview_url') : (status && status.getIn(['account', 'avatar_static']))}
            backgroundColor={attachment.getIn(['meta', 'colors', 'background'])}
            foregroundColor={attachment.getIn(['meta', 'colors', 'foreground'])}
            accentColor={attachment.getIn(['meta', 'colors', 'accent'])}
            duration={attachment.getIn(['meta', 'original', 'duration'], 0)}
            key={attachment.get('url')}
          />
        );
      } else if (attachment.get('type') === 'gifv') {
        return (
          <ExtendedVideoPlayer
            src={attachment.get('url')}
            muted
            controls={false}
            width={width}
            link={link}
            height={height}
            key={attachment.get('preview_url')}
            alt={attachment.get('description')}
            onClick={this.toggleNavigation}
          />
        );
      }

      return null;
    }).toArray();

    // you can't use 100vh, because the viewport height is taller
    // than the visible part of the document in some mobile
    // browsers when it's address bar is visible.
    // https://developers.google.com/web/updates/2016/12/url-bar-resizing
    const swipeableViewsStyle = {
      width: '100%',
      height: '100%',
    };

    const containerStyle = {
      alignItems: 'center', // center vertically
    };

    const navigationClassName = classNames('media-modal__navigation', {
      'media-modal__navigation--hidden': navigationHidden,
    });

    return (
      <div className='modal-root__modal media-modal'>
        <div
          className='media-modal__closer'
          role='presentation'
          onClick={this.handleCloserClick}
        >
          <ReactSwipeableViews
            style={swipeableViewsStyle}
            containerStyle={containerStyle}
            onChangeIndex={this.handleSwipe}
            onSwitching={this.handleSwitching}
            index={index}
          >
            {content}
          </ReactSwipeableViews>
        </div>

        <div className={navigationClassName}>
          <IconButton className='media-modal__close' title={intl.formatMessage(messages.close)} src={require('@tabler/icons/icons/x.svg')} onClick={onClose} />

          {leftNav}
          {rightNav}

          {(status && !isMultiMedia[index]) && (
            <div className={classNames('media-modal__meta', { 'media-modal__meta--shifted': media.size > 1 })}>
              <a href={status.get('url')} onClick={this.handleStatusClick}><FormattedMessage id='lightbox.view_context' defaultMessage='View context' /></a>
            </div>
          )}

          <ul className='media-modal__pagination'>
            {pagination}
          </ul>
        </div>
      </div>
    );
  }

}
