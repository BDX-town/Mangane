import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Icon from 'soapbox/components/icon';
import classNames from 'classnames';
import Blurhash from 'soapbox/components/blurhash';
import { isIOS } from 'soapbox/is_mobile';
import { getSettings } from 'soapbox/actions/settings';
import StillImage from 'soapbox/components/still_image';

const mapStateToProps = state => ({
  autoPlayGif: getSettings(state).get('autoPlayGif'),
  displayMedia: getSettings(state).get('displayMedia'),
});

export default @connect(mapStateToProps)
class MediaItem extends ImmutablePureComponent {

  static propTypes = {
    attachment: ImmutablePropTypes.map.isRequired,
    displayWidth: PropTypes.number.isRequired,
    onOpenMedia: PropTypes.func.isRequired,
    autoPlayGif: PropTypes.bool,
    displayMedia: PropTypes.string,
  };

  state = {
    visible: this.props.displayMedia !== 'hide_all' && !this.props.attachment.getIn(['status', 'sensitive']) || this.props.displayMedia === 'show_all',
    loaded: false,
  };

  handleImageLoad = () => {
    this.setState({ loaded: true });
  }

  handleMouseEnter = e => {
    if (this.hoverToPlay()) {
      e.target.play();
    }
  }

  handleMouseLeave = e => {
    if (this.hoverToPlay()) {
      e.target.pause();
      e.target.currentTime = 0;
    }
  }

  hoverToPlay = () => {
    const { autoPlayGif } = this.props;
    return !autoPlayGif && ['gifv', 'video'].indexOf(this.props.attachment.get('type')) !== -1;
  }

  handleClick = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();

      if (this.state.visible) {
        this.props.onOpenMedia(this.props.attachment);
      } else {
        this.setState({ visible: true });
      }
    }
  }

  render() {
    const { attachment, displayWidth, autoPlayGif } = this.props;
    const { visible, loaded } = this.state;

    const width  = `${Math.floor((displayWidth - 4) / 3) - 4}px`;
    const height = width;
    const status = attachment.get('status');
    const title = status.get('spoiler_text') || attachment.get('description');

    let thumbnail = '';
    let icon;

    if (attachment.get('type') === 'unknown') {
      // Skip
    } else if (attachment.get('type') === 'image') {
      const focusX = attachment.getIn(['meta', 'focus', 'x']) || 0;
      const focusY = attachment.getIn(['meta', 'focus', 'y']) || 0;
      const x      = ((focusX /  2) + .5) * 100;
      const y      = ((focusY / -2) + .5) * 100;

      thumbnail = (
        <StillImage
          src={attachment.get('preview_url')}
          alt={attachment.get('description')}
          style={{ objectPosition: `${x}% ${y}%` }}
        />
      );
    } else if (['gifv', 'video'].indexOf(attachment.get('type')) !== -1) {
      const conditionalAttributes = {};
      if (isIOS()) {
        conditionalAttributes.playsInline = '1';
      }
      if (autoPlayGif) {
        conditionalAttributes.autoPlay = '1';
      }
      thumbnail = (
        <div className={classNames('media-gallery__gifv', { autoplay: autoPlayGif })}>
          <video
            className='media-gallery__item-gifv-thumbnail'
            aria-label={attachment.get('description')}
            title={attachment.get('description')}
            role='application'
            src={attachment.get('url')}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            loop
            muted
            {...conditionalAttributes}
          />

          <span className='media-gallery__gifv__label'>GIF</span>
        </div>
      );
    } else if (attachment.get('type') === 'audio') {
      const remoteURL = attachment.get('remote_url');
      const fileExtensionLastIndex = remoteURL.lastIndexOf('.');
      const fileExtension = remoteURL.substr(fileExtensionLastIndex + 1).toUpperCase();
      thumbnail = (
        <div className='media-gallery__item-thumbnail'>
          <span className='media-gallery__item__icons'><Icon id='volume-up' /></span>
          <span className='media-gallery__file-extension__label'>{fileExtension}</span>
        </div>
      );
    }

    if (!visible) {
      icon = (
        <span className='account-gallery__item__icons'>
          <Icon id='eye-slash' />
        </span>
      );
    }

    return (
      <div className='account-gallery__item' style={{ width, height }}>
        <a className='media-gallery__item-thumbnail' href={status.get('url')} target='_blank' onClick={this.handleClick} title={title}>
          <Blurhash
            hash={attachment.get('blurhash')}
            className={classNames('media-gallery__preview', {
              'media-gallery__preview--hidden': visible && loaded,
            })}
          />
          {visible && thumbnail}
          {!visible && icon}
        </a>
      </div>
    );
  }

}
