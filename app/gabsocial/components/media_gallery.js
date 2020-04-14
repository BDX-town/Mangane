import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { is } from 'immutable';
import IconButton from './icon_button';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { isIOS } from '../is_mobile';
import classNames from 'classnames';
import { autoPlayGif, displayMedia } from '../initial_state';
import { decode } from 'blurhash';
import { isPanoramic, isPortrait, isNonConformingRatio, minimumAspectRatio, maximumAspectRatio } from '../utils/media_aspect_ratio';

const messages = defineMessages({
  toggle_visible: { id: 'media_gallery.toggle_visible', defaultMessage: 'Toggle visibility' },
});

class Item extends React.PureComponent {

  static propTypes = {
    attachment: ImmutablePropTypes.map.isRequired,
    standalone: PropTypes.bool,
    index: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    displayWidth: PropTypes.number,
    visible: PropTypes.bool.isRequired,
    dimensions: PropTypes.object,
  };

  static defaultProps = {
    standalone: false,
    index: 0,
    size: 1,
  };

  state = {
    loaded: false,
  };

  handleMouseEnter = (e) => {
    if (this.hoverToPlay()) {
      e.target.play();
    }
  }

  handleMouseLeave = (e) => {
    if (this.hoverToPlay()) {
      e.target.pause();
      e.target.currentTime = 0;
    }
  }

  hoverToPlay () {
    const { attachment } = this.props;
    return !autoPlayGif && attachment.get('type') === 'gifv';
  }

  handleClick = (e) => {
    const { index, onClick } = this.props;

    if (isIOS() && !e.target.autoPlay) {
      e.target.autoPlay = true;
      e.preventDefault();
    } else {
      if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
        if (this.hoverToPlay()) {
          e.target.pause();
          e.target.currentTime = 0;
        }
        e.preventDefault();
        onClick(index);
      }
    }

    e.stopPropagation();
  }

  componentDidMount () {
    if (this.props.attachment.get('blurhash')) {
      this._decode();
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.attachment.get('blurhash') !== this.props.attachment.get('blurhash') && this.props.attachment.get('blurhash')) {
      this._decode();
    }
  }

  _decode () {
    const hash   = this.props.attachment.get('blurhash');
    const pixels = decode(hash, 32, 32);

    if (pixels) {
      const ctx       = this.canvas.getContext('2d');
      const imageData = new ImageData(pixels, 32, 32);

      ctx.putImageData(imageData, 0, 0);
    }
  }

  setCanvasRef = c => {
    this.canvas = c;
  }

  handleImageLoad = () => {
    this.setState({ loaded: true });
  }

  render () {
    const { attachment, index, size, standalone, displayWidth, visible, dimensions } = this.props;

    const ar = attachment.getIn(['meta', 'small', 'aspect']);

    let width  = 100;
    let height = '100%';
    let top    = 'auto';
    let left   = 'auto';
    let bottom = 'auto';
    let right  = 'auto';
    let float = 'left';
    let position = 'relative';

    if (dimensions) {
      width = dimensions.w;
      height = dimensions.h;
      top = dimensions.t || 'auto';
      right = dimensions.r || 'auto';
      bottom = dimensions.b || 'auto';
      left = dimensions.l || 'auto';
      float = dimensions.float || 'left';
      position = dimensions.pos || 'relative';
    }

    let thumbnail = '';

    if (attachment.get('type') === 'unknown') {
      return (
        <div className={classNames('media-gallery__item', { standalone })} key={attachment.get('id')} style={{ position, float, left, top, right, bottom, height, width: `${width}%` }}>
          <a className='media-gallery__item-thumbnail' href={attachment.get('remote_url')} target='_blank' style={{ cursor: 'pointer' }}>
            <canvas width={32} height={32} ref={this.setCanvasRef} className='media-gallery__preview' />
          </a>
        </div>
      );
    } else if (attachment.get('type') === 'image') {
      const previewUrl   = attachment.get('preview_url');
      const previewWidth = attachment.getIn(['meta', 'small', 'width']);

      const originalUrl   = attachment.get('url');
      const originalWidth = attachment.getIn(['meta', 'original', 'width']);

      const hasSize = typeof originalWidth === 'number' && typeof previewWidth === 'number';

      const srcSet = hasSize ? `${originalUrl} ${originalWidth}w, ${previewUrl} ${previewWidth}w` : null;
      const sizes  = hasSize && (displayWidth > 0) ? `${displayWidth * (width / 100)}px` : null;

      const focusX = attachment.getIn(['meta', 'focus', 'x']) || 0;
      const focusY = attachment.getIn(['meta', 'focus', 'y']) || 0;
      const x      = ((focusX /  2) + .5) * 100;
      const y      = ((focusY / -2) + .5) * 100;

      thumbnail = (
        <a
          className='media-gallery__item-thumbnail'
          href={attachment.get('remote_url') || originalUrl}
          onClick={this.handleClick}
          target='_blank'
        >
          <img
            src={previewUrl}
            srcSet={srcSet}
            sizes={sizes}
            alt={attachment.get('description')}
            title={attachment.get('description')}
            style={{ objectPosition: `${x}% ${y}%` }}
            onLoad={this.handleImageLoad}
          />
        </a>
      );
    } else if (attachment.get('type') === 'gifv') {
      let conditionalAttributes = {};
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
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            loop
            muted
            {...conditionalAttributes}
          />

          <span className='media-gallery__gifv__label'>GIF</span>
        </div>
      );
    }

    return (
      <div className={classNames('media-gallery__item', { standalone })} key={attachment.get('id')} style={{ position, float, left, top, right, bottom, height, width: `${width}%` }}>
        <canvas width={32} height={32} ref={this.setCanvasRef} className={classNames('media-gallery__preview', { 'media-gallery__preview--hidden': visible && this.state.loaded })} />
        {visible && thumbnail}
      </div>
    );
  }

}

export default @injectIntl
class MediaGallery extends React.PureComponent {

  static propTypes = {
    sensitive: PropTypes.bool,
    standalone: PropTypes.bool,
    media: ImmutablePropTypes.list.isRequired,
    size: PropTypes.object,
    height: PropTypes.number.isRequired,
    onOpenMedia: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    defaultWidth: PropTypes.number,
    cacheWidth: PropTypes.func,
    visible: PropTypes.bool,
    onToggleVisibility: PropTypes.func,
  };

  static defaultProps = {
    standalone: false,
  };

  state = {
    visible: this.props.visible !== undefined ? this.props.visible : (displayMedia !== 'hide_all' && !this.props.sensitive || displayMedia === 'show_all'),
    width: this.props.defaultWidth,
  };

  componentWillReceiveProps (nextProps) {
    if (!is(nextProps.media, this.props.media) && nextProps.visible === undefined) {
      this.setState({ visible: displayMedia !== 'hide_all' && !nextProps.sensitive || displayMedia === 'show_all' });
    } else if (!is(nextProps.visible, this.props.visible) && nextProps.visible !== undefined) {
      this.setState({ visible: nextProps.visible });
    }
  }

  handleOpen = () => {
    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility();
    } else {
      this.setState({ visible: !this.state.visible });
    }
  }

  handleClick = (index) => {
    this.props.onOpenMedia(this.props.media, index);
  }

  handleRef = (node) => {
    if (node) {
      // offsetWidth triggers a layout, so only calculate when we need to
      if (this.props.cacheWidth) this.props.cacheWidth(node.offsetWidth);

      this.setState({
        width: node.offsetWidth,
      });
    }
  }

  render () {
    const { media, intl, sensitive, height, defaultWidth } = this.props;
    const { visible } = this.state;

    const width = this.state.width || defaultWidth;

    let children, spoilerButton;

    const style = {};
    const size = media.take(4).size;

    const standard169 = width / (16 / 9);
    const standard169_percent = 100 / (16 / 9);
    const standard169_px = `${standard169}px`;
    const panoSize = Math.floor(width / maximumAspectRatio);
    const panoSize_px = `${Math.floor(width / maximumAspectRatio)}px`;
    let itemsDimensions = [];

    if (size == 1 && width) {
      const aspectRatio = media.getIn([0, 'meta', 'small', 'aspect']);

      if (isPanoramic(aspectRatio)) {
        style.height = Math.floor(width / maximumAspectRatio);
      } else if (isPortrait(aspectRatio)) {
        style.height = Math.floor(width / minimumAspectRatio);
      } else {
        style.height = Math.floor(width / aspectRatio);
      }
    } else if (size > 1 && width) {
      const ar1 = media.getIn([0, 'meta', 'small', 'aspect']);
      const ar2 = media.getIn([1, 'meta', 'small', 'aspect']);
      const ar3 = media.getIn([2, 'meta', 'small', 'aspect']);
      const ar4 = media.getIn([3, 'meta', 'small', 'aspect']);

      if (size == 2) {
        if (isPortrait(ar1) && isPortrait(ar2)) {
          style.height = width - (width / maximumAspectRatio);
        } else if (isPanoramic(ar1) && isPanoramic(ar2)) {
          style.height = panoSize * 2;
        } else if (
          (isPanoramic(ar1) && isPortrait(ar2)) ||
          (isPortrait(ar1) && isPanoramic(ar2)) ||
          (isPanoramic(ar1) && isNonConformingRatio(ar2)) ||
          (isNonConformingRatio(ar1) && isPanoramic(ar2))
        ) {
          style.height = (width * 0.6) + (width / maximumAspectRatio);
        } else {
          style.height = width / 2;
        }

        //

        if (isPortrait(ar1) && isPortrait(ar2)) {
          itemsDimensions = [
            { w: 50, h: '100%', r: '2px' },
            { w: 50, h: '100%', l: '2px' },
          ];
        } else if (isPanoramic(ar1) && isPanoramic(ar2)) {
          itemsDimensions = [
            { w: 100, h: panoSize_px, b: '2px' },
            { w: 100, h: panoSize_px, t: '2px' },
          ];
        } else if (
          (isPanoramic(ar1) && isPortrait(ar2)) ||
          (isPanoramic(ar1) && isNonConformingRatio(ar2))
        ) {
          itemsDimensions = [
            { w: 100, h: `${(width / maximumAspectRatio)}px`, b: '2px' },
            { w: 100, h: `${(width * 0.6)}px`, t: '2px' },
          ];
        } else if (
          (isPortrait(ar1) && isPanoramic(ar2)) ||
          (isNonConformingRatio(ar1) && isPanoramic(ar2))
        ) {
          itemsDimensions = [
            { w: 100, h: `${(width * 0.6)}px`, b: '2px' },
            { w: 100, h: `${(width / maximumAspectRatio)}px`, t: '2px' },
          ];
        } else {
          itemsDimensions = [
            { w: 50, h: '100%', r: '2px' },
            { w: 50, h: '100%', l: '2px' },
          ];
        }
      } else if (size == 3) {
        if (isPanoramic(ar1) && isPanoramic(ar2) && isPanoramic(ar3)) {
          style.height = panoSize * 3;
        } else if (isPortrait(ar1) && isPortrait(ar2) && isPortrait(ar3)) {
          style.height = Math.floor(width / minimumAspectRatio);
        } else {
          style.height = width;
        }

        //

        if (isPanoramic(ar1) && isNonConformingRatio(ar2) && isNonConformingRatio(ar3)) {
          itemsDimensions = [
            { w: 100, h: '50%', b: '2px' },
            { w: 50, h: '50%', t: '2px', r: '2px' },
            { w: 50, h: '50%', t: '2px', l: '2px' },
          ];
        } else if (isPanoramic(ar1) && isPanoramic(ar2) && isPanoramic(ar3)) {
          itemsDimensions = [
            { w: 100, h: panoSize_px, b: '4px' },
            { w: 100, h: panoSize_px },
            { w: 100, h: panoSize_px, t: '4px' },
          ];
        } else if (isPortrait(ar1) && isNonConformingRatio(ar2) && isNonConformingRatio(ar3)) {
          itemsDimensions = [
            { w: 50, h: '100%', r: '2px' },
            { w: 50, h: '50%', b: '2px', l: '2px' },
            { w: 50, h: '50%', t: '2px', l: '2px' },
          ];
        } else if (isNonConformingRatio(ar1) && isNonConformingRatio(ar2) && isPortrait(ar3)) {
          itemsDimensions = [
            { w: 50, h: '50%', b: '2px', r: '2px' },
            { w: 50, h: '50%', l: '-2px', b: '-2px', pos: 'absolute', float: 'none' },
            { w: 50, h: '100%', r: '-2px', t: '0px', b: '0px', pos: 'absolute', float: 'none' },
          ];
        } else if (
          (isNonConformingRatio(ar1) && isPortrait(ar2) && isNonConformingRatio(ar3)) ||
          (isPortrait(ar1) && isPortrait(ar2) && isPortrait(ar3))
        ) {
          itemsDimensions = [
            { w: 50, h: '50%', b: '2px', r: '2px' },
            { w: 50, h: '100%', l: '2px', float: 'right' },
            { w: 50, h: '50%', t: '2px', r: '2px' },
          ];
        } else if (
          (isPanoramic(ar1) && isPanoramic(ar2) && isNonConformingRatio(ar3)) ||
          (isPanoramic(ar1) && isPanoramic(ar2) && isPortrait(ar3))
        ) {
          itemsDimensions = [
            { w: 50, h: panoSize_px, b: '2px', r: '2px' },
            { w: 50, h: panoSize_px, b: '2px', l: '2px' },
            { w: 100, h: `${width - panoSize}px`, t: '2px' },
          ];
        } else if (
          (isNonConformingRatio(ar1) && isPanoramic(ar2) && isPanoramic(ar3)) ||
          (isPortrait(ar1) && isPanoramic(ar2) && isPanoramic(ar3))
        ) {
          itemsDimensions = [
            { w: 100, h: `${width - panoSize}px`, b: '2px' },
            { w: 50, h: panoSize_px, t: '2px', r: '2px' },
            { w: 50, h: panoSize_px, t: '2px', l: '2px' },
          ];
        } else {
          itemsDimensions = [
            { w: 50, h: '50%', b: '2px', r: '2px' },
            { w: 50, h: '50%', b: '2px', l: '2px' },
            { w: 100, h: '50%', t: '2px' },
          ];
        }
      } else if (size == 4) {
        if (
          (isPortrait(ar1) && isPortrait(ar2) && isPortrait(ar3) && isPortrait(ar4)) ||
          (isPortrait(ar1) && isPortrait(ar2) && isPortrait(ar3) && isNonConformingRatio(ar4)) ||
          (isPortrait(ar1) && isPortrait(ar2) && isNonConformingRatio(ar3) && isPortrait(ar4)) ||
          (isPortrait(ar1) && isNonConformingRatio(ar2) && isPortrait(ar3) && isPortrait(ar4)) ||
          (isNonConformingRatio(ar1) && isPortrait(ar2) && isPortrait(ar3) && isPortrait(ar4))
        ) {
          style.height = Math.floor(width / minimumAspectRatio);
        } else if (isPanoramic(ar1) && isPanoramic(ar2) && isPanoramic(ar3) && isPanoramic(ar4)) {
          style.height = panoSize * 2;
        } else if (
          (isPanoramic(ar1) && isPanoramic(ar2) && isNonConformingRatio(ar3) && isNonConformingRatio(ar4)) ||
          (isNonConformingRatio(ar1) && isNonConformingRatio(ar2) && isPanoramic(ar3) && isPanoramic(ar4))
        ) {
          style.height = panoSize + (width / 2);
        } else {
          style.height = width;
        }

        //

        if (isPanoramic(ar1) && isPanoramic(ar2) && isNonConformingRatio(ar3) && isNonConformingRatio(ar4)) {
          itemsDimensions = [
            { w: 50, h: panoSize_px, b: '2px', r: '2px' },
            { w: 50, h: panoSize_px, b: '2px', l: '2px' },
            { w: 50, h: `${(width / 2)}px`, t: '2px', r: '2px' },
            { w: 50, h: `${(width / 2)}px`, t: '2px', l: '2px' },
          ];
        } else if (isNonConformingRatio(ar1) && isNonConformingRatio(ar2) && isPanoramic(ar3) && isPanoramic(ar4)) {
          itemsDimensions = [
            { w: 50, h: `${(width / 2)}px`, b: '2px', r: '2px' },
            { w: 50, h: `${(width / 2)}px`, b: '2px', l: '2px' },
            { w: 50, h: panoSize_px, t: '2px', r: '2px' },
            { w: 50, h: panoSize_px, t: '2px', l: '2px' },
          ];
        } else if (
          (isPortrait(ar1) && isNonConformingRatio(ar2) && isNonConformingRatio(ar3) && isNonConformingRatio(ar4)) ||
          (isPortrait(ar1) && isPanoramic(ar2) && isPanoramic(ar3) && isPanoramic(ar4))
        ) {
          itemsDimensions = [
            { w: 67, h: '100%', r: '2px' },
            { w: 33, h: '33%', b: '4px', l: '2px' },
            { w: 33, h: '33%', l: '2px' },
            { w: 33, h: '33%', t: '4px', l: '2px' },
          ];
        } else {
          itemsDimensions = [
            { w: 50, h: '50%', b: '2px', r: '2px' },
            { w: 50, h: '50%', b: '2px', l: '2px' },
            { w: 50, h: '50%', t: '2px', r: '2px' },
            { w: 50, h: '50%', t: '2px', l: '2px' },
          ];
        }
      }
    } else {
      style.height = height;
    }

    children = media.take(4).map((attachment, i) => (
      <Item
        key={attachment.get('id')}
        onClick={this.handleClick}
        attachment={attachment}
        index={i}
        size={size}
        displayWidth={width}
        visible={visible}
        dimensions={itemsDimensions[i]}
      />
    ));

    if (visible) {
      spoilerButton = <IconButton title={intl.formatMessage(messages.toggle_visible)} icon='eye-slash' overlay onClick={this.handleOpen} />;
    } else {
      spoilerButton = (
        <button type='button' onClick={this.handleOpen} className='spoiler-button__overlay'>
          <span className='spoiler-button__overlay__label'>{sensitive ? <FormattedMessage id='status.sensitive_warning' defaultMessage='Sensitive content' /> : <FormattedMessage id='status.media_hidden' defaultMessage='Media hidden' />}</span>
        </button>
      );
    }

    return (
      <div className='media-gallery' style={style} ref={this.handleRef}>
        <div className={classNames('spoiler-button', { 'spoiler-button--minified': visible })}>
          {spoilerButton}
        </div>

        {children}
      </div>
    );
  }

}
