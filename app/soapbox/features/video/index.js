import classNames from 'classnames';
import { fromJS, is } from 'immutable';
import { throttle, debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';
import Blurhash from 'soapbox/components/blurhash';
import Icon from 'soapbox/components/icon';

import { isPanoramic, isPortrait, minimumAspectRatio, maximumAspectRatio } from '../../utils/media_aspect_ratio';
import { isFullscreen, requestFullscreen, exitFullscreen } from '../ui/util/fullscreen';

const DEFAULT_HEIGHT = 300;

const messages = defineMessages({
  play: { id: 'video.play', defaultMessage: 'Play' },
  pause: { id: 'video.pause', defaultMessage: 'Pause' },
  mute: { id: 'video.mute', defaultMessage: 'Mute sound' },
  unmute: { id: 'video.unmute', defaultMessage: 'Unmute sound' },
  hide: { id: 'video.hide', defaultMessage: 'Hide video' },
  expand: { id: 'video.expand', defaultMessage: 'Expand video' },
  close: { id: 'video.close', defaultMessage: 'Close video' },
  fullscreen: { id: 'video.fullscreen', defaultMessage: 'Full screen' },
  exit_fullscreen: { id: 'video.exit_fullscreen', defaultMessage: 'Exit full screen' },
});

export const formatTime = secondsNum => {
  let hours   = Math.floor(secondsNum / 3600);
  let minutes = Math.floor((secondsNum - (hours * 3600)) / 60);
  let seconds = secondsNum - (hours * 3600) - (minutes * 60);

  if (hours   < 10) hours   = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;

  return (hours === '00' ? '' : `${hours}:`) + `${minutes}:${seconds}`;
};

export const findElementPosition = el => {
  let box;

  if (el.getBoundingClientRect && el.parentNode) {
    box = el.getBoundingClientRect();
  }

  if (!box) {
    return {
      left: 0,
      top: 0,
    };
  }

  const docEl = document.documentElement;
  const body  = document.body;

  const clientLeft = docEl.clientLeft || body.clientLeft || 0;
  const scrollLeft = window.pageXOffset || body.scrollLeft;
  const left       = (box.left + scrollLeft) - clientLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const scrollTop = window.pageYOffset || body.scrollTop;
  const top       = (box.top + scrollTop) - clientTop;

  return {
    left: Math.round(left),
    top: Math.round(top),
  };
};

export const getPointerPosition = (el, event) => {
  const position = {};
  const box = findElementPosition(el);
  const boxW = el.offsetWidth;
  const boxH = el.offsetHeight;
  const boxY = box.top;
  const boxX = box.left;

  let pageY = event.pageY;
  let pageX = event.pageX;

  if (event.changedTouches) {
    pageX = event.changedTouches[0].pageX;
    pageY = event.changedTouches[0].pageY;
  }

  position.y = Math.max(0, Math.min(1, (pageY - boxY) / boxH));
  position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));

  return position;
};

export const fileNameFromURL = str => {
  const url      = new URL(str);
  const pathname = url.pathname;
  const index    = pathname.lastIndexOf('/');

  return pathname.substring(index + 1);
};

const mapStateToProps = state => ({
  displayMedia: getSettings(state).get('displayMedia'),
});

export default @connect(mapStateToProps)
@injectIntl
class Video extends React.PureComponent {

  static propTypes = {
    preview: PropTypes.string,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    sensitive: PropTypes.bool,
    startTime: PropTypes.number,
    onOpenVideo: PropTypes.func,
    onCloseVideo: PropTypes.func,
    detailed: PropTypes.bool,
    inline: PropTypes.bool,
    cacheWidth: PropTypes.func,
    visible: PropTypes.bool,
    onToggleVisibility: PropTypes.func,
    intl: PropTypes.object.isRequired,
    blurhash: PropTypes.string,
    link: PropTypes.node,
    aspectRatio: PropTypes.number,
    displayMedia: PropTypes.string,
  };

  state = {
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    paused: true,
    dragging: false,
    containerWidth: this.props.width,
    fullscreen: false,
    hovered: false,
    muted: false,
    revealed: this.props.visible !== undefined ? this.props.visible : (this.props.displayMedia !== 'hide_all' && !this.props.sensitive || this.props.displayMedia === 'show_all'),
  };

  setPlayerRef = c => {
    this.player = c;

    if (this.player) {
      this._setDimensions();
    }
  }

  _setDimensions() {
    const width = this.player.offsetWidth;

    if (this.props.cacheWidth) {
      this.props.cacheWidth(width);
    }

    this.setState({
      containerWidth: width,
    });
  }

  setVideoRef = c => {
    this.video = c;

    if (this.video) {
      this.setState({ volume: this.video.volume, muted: this.video.muted });
    }
  }

  setSeekRef = c => {
    this.seek = c;
  }

  setVolumeRef = c => {
    this.volume = c;
  }

  handleClickRoot = e => e.stopPropagation();

  handlePlay = () => {
    this.setState({ paused: false });
  }

  handlePause = () => {
    this.setState({ paused: true });
  }

  handleTimeUpdate = () => {
    this.setState({
      currentTime: Math.floor(this.video.currentTime),
      duration: Math.floor(this.video.duration),
    });
  }

  handleVolumeMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseVolSlide, true);
    document.addEventListener('mouseup', this.handleVolumeMouseUp, true);
    document.addEventListener('touchmove', this.handleMouseVolSlide, true);
    document.addEventListener('touchend', this.handleVolumeMouseUp, true);

    this.handleMouseVolSlide(e);

    e.preventDefault();
    e.stopPropagation();
  }

  handleVolumeMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseVolSlide, true);
    document.removeEventListener('mouseup', this.handleVolumeMouseUp, true);
    document.removeEventListener('touchmove', this.handleMouseVolSlide, true);
    document.removeEventListener('touchend', this.handleVolumeMouseUp, true);
  }

  handleMouseVolSlide = throttle(e => {
    const { x } = getPointerPosition(this.volume, e);

    if (!isNaN(x)) {
      let slideamt = x;

      if (x > 1) {
        slideamt = 1;
      } else if (x < 0) {
        slideamt = 0;
      }

      this.video.volume = slideamt;
      this.setState({ volume: slideamt });
    }
  }, 60);

  handleMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('mouseup', this.handleMouseUp, true);
    document.addEventListener('touchmove', this.handleMouseMove, true);
    document.addEventListener('touchend', this.handleMouseUp, true);

    this.setState({ dragging: true });
    this.video.pause();
    this.handleMouseMove(e);

    e.preventDefault();
    e.stopPropagation();
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('mouseup', this.handleMouseUp, true);
    document.removeEventListener('touchmove', this.handleMouseMove, true);
    document.removeEventListener('touchend', this.handleMouseUp, true);

    this.setState({ dragging: false });
    this.video.play();
  }

  handleMouseMove = throttle(e => {
    const { x } = getPointerPosition(this.seek, e);
    const currentTime = Math.floor(this.video.duration * x);

    if (!isNaN(currentTime)) {
      this.video.currentTime = currentTime;
      this.setState({ currentTime });
    }
  }, 60);

  seekBy(time) {
    const currentTime = this.video.currentTime + time;

    if (!isNaN(currentTime)) {
      this.setState({ currentTime }, () => {
        this.video.currentTime = currentTime;
      });
    }
  }

  handleVideoKeyDown = e => {
    // On the video element or the seek bar, we can safely use the space bar
    // for playback control because there are no buttons to press

    if (e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      this.togglePlay();
    }
  }

  handleKeyDown = e => {
    const frameTime = 1 / 25;

    switch (e.key) {
      case 'k':
        e.preventDefault();
        e.stopPropagation();
        this.togglePlay();
        break;
      case 'm':
        e.preventDefault();
        e.stopPropagation();
        this.toggleMute();
        break;
      case 'f':
        e.preventDefault();
        e.stopPropagation();
        this.toggleFullscreen();
        break;
      case 'j':
        e.preventDefault();
        e.stopPropagation();
        this.seekBy(-10);
        break;
      case 'l':
        e.preventDefault();
        e.stopPropagation();
        this.seekBy(10);
        break;
      case ',':
        e.preventDefault();
        e.stopPropagation();
        this.seekBy(-frameTime);
        break;
      case '.':
        e.preventDefault();
        e.stopPropagation();
        this.seekBy(frameTime);
        break;
    }

    // If we are in fullscreen mode, we don't want any hotkeys
    // interacting with the UI that's not visible

    if (this.state.fullscreen) {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        exitFullscreen();
      }
    }
  }

  togglePlay = (e) => {
    if (e) {
      e.stopPropagation();
    }

    if (this.state.paused) {
      this.setState({ paused: false }, () => this.video.play());
    } else {
      this.setState({ paused: true }, () => this.video.pause());
    }
  }

  toggleFullscreen = () => {
    if (isFullscreen()) {
      exitFullscreen();
    } else {
      requestFullscreen(this.player);
    }
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange, true);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange, true);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange, true);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange, true);

    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);

    document.removeEventListener('fullscreenchange', this.handleFullscreenChange, true);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange, true);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange, true);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange, true);
  }

  componentDidUpdate(prevProps, prevState) {
    const { visible } = this.props;

    if (!is(visible, prevProps.visible) && visible !== undefined) {
      this.setState({ revealed: visible });
    }

    if (prevState.revealed && !this.state.revealed && this.video) {
      this.video.pause();
    }
  }

  handleResize = debounce(() => {
    if (this.player) {
      this._setDimensions();
    }
  }, 250, {
    trailing: true,
  });

  handleScroll = throttle(() => {
    if (!this.video) {
      return;
    }

    const { top, height } = this.video.getBoundingClientRect();
    const inView = (top <= (window.innerHeight || document.documentElement.clientHeight)) && (top + height >= 0);

    if (!this.state.paused && !inView) {
      this.setState({ paused: true }, () => this.video.pause());
    }
  }, 150, { trailing: true })

  handleFullscreenChange = () => {
    this.setState({ fullscreen: isFullscreen() });
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  }

  toggleMute = () => {
    const muted = !this.video.muted;

    this.setState({ muted }, () => {
      this.video.muted = muted;
    });
  }

  toggleReveal = (e) => {
    e.stopPropagation();

    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility();
    } else {
      this.setState({ revealed: !this.state.revealed });
    }
  }

  handleLoadedData = () => {
    if (this.props.startTime) {
      this.video.currentTime = this.props.startTime;
      this.video.play();
    }
  }

  handleProgress = () => {
    if (this.video.buffered.length > 0) {
      this.setState({ buffer: this.video.buffered.end(0) / this.video.duration * 100 });
    }
  }

  handleVolumeChange = () => {
    this.setState({ volume: this.video.volume, muted: this.video.muted });
  }

  handleOpenVideo = () => {
    const { src, preview, width, height, alt } = this.props;

    const media = fromJS({
      type: 'video',
      url: src,
      preview_url: preview,
      description: alt,
      width,
      height,
    });

    this.video.pause();
    this.props.onOpenVideo(media, this.video.currentTime);
  }

  handleCloseVideo = () => {
    this.video.pause();
    this.props.onCloseVideo();
  }

  getPreload = () => {
    const { startTime, detailed } = this.props;
    const { dragging, fullscreen } = this.state;

    if (startTime || fullscreen || dragging) {
      return 'auto';
    } else if (detailed) {
      return 'metadata';
    } else {
      return 'none';
    }
  }

  render() {
    const { src, inline, onOpenVideo, onCloseVideo, intl, alt, detailed, sensitive, link, aspectRatio, blurhash } = this.props;
    const { containerWidth, currentTime, duration, volume, buffer, dragging, paused, fullscreen, hovered, muted, revealed } = this.state;
    const progress = (currentTime / duration) * 100;
    const playerStyle = {};

    let { width, height } = this.props;

    if (inline && containerWidth) {
      width = containerWidth;
      const minSize = containerWidth / (16 / 9);

      if (isPanoramic(aspectRatio)) {
        height = Math.max(Math.floor(containerWidth / maximumAspectRatio), minSize);
      } else if (isPortrait(aspectRatio)) {
        height = Math.max(Math.floor(containerWidth / minimumAspectRatio), minSize);
      } else {
        height = Math.floor(containerWidth / aspectRatio);
      }

      playerStyle.height = height || DEFAULT_HEIGHT;
    }

    let warning;

    if (sensitive) {
      warning = <FormattedMessage id='status.sensitive_warning' defaultMessage='Sensitive content' />;
    } else {
      warning = <FormattedMessage id='status.media_hidden' defaultMessage='Media hidden' />;
    }

    return (
      <div
        role='menuitem'
        className={classNames('video-player', { 'video-player--inactive': !revealed, detailed, 'video-player--inline': inline && !fullscreen, fullscreen })}
        style={playerStyle}
        ref={this.setPlayerRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClickRoot}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
      >
        <Blurhash
          hash={blurhash}
          className={classNames('media-gallery__preview', {
            'media-gallery__preview--hidden': revealed,
          })}
        />

        {revealed && <video
          ref={this.setVideoRef}
          src={src}
          // preload={this.getPreload()}
          loop
          role='button'
          tabIndex='0'
          aria-label={alt}
          title={alt}
          width={width}
          height={height || DEFAULT_HEIGHT}
          volume={volume}
          onClick={this.togglePlay}
          onKeyDown={this.handleVideoKeyDown}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onTimeUpdate={this.handleTimeUpdate}
          onLoadedData={this.handleLoadedData}
          onProgress={this.handleProgress}
          onVolumeChange={this.handleVolumeChange}
        />}

        <div className={classNames('spoiler-button', { 'spoiler-button--hidden': !sensitive || revealed })}>
          <button type='button' className='spoiler-button__overlay' onClick={this.toggleReveal}>
            <span className='spoiler-button__overlay__label'>{warning}</span>
          </button>
        </div>

        <div className={classNames('video-player__controls', { active: paused || hovered })}>
          <div className='video-player__seek' onMouseDown={this.handleMouseDown} ref={this.setSeekRef}>
            <div className='video-player__seek__buffer' style={{ width: `${buffer}%` }} />
            <div className='video-player__seek__progress' style={{ width: `${progress}%` }} />

            <span
              className={classNames('video-player__seek__handle', { active: dragging })}
              tabIndex='0'
              style={{ left: `${progress}%` }}
              onKeyDown={this.handleVideoKeyDown}
            />
          </div>

          <div className='video-player__buttons-bar'>
            <div className='video-player__buttons left'>
              <button type='button' title={intl.formatMessage(paused ? messages.play : messages.pause)} aria-label={intl.formatMessage(paused ? messages.play : messages.pause)} className='player-button' onClick={this.togglePlay} autoFocus={detailed}><Icon src={paused ? require('@tabler/icons/icons/player-play.svg') : require('@tabler/icons/icons/player-pause.svg')} /></button>
              <button type='button' title={intl.formatMessage(muted ? messages.unmute : messages.mute)} aria-label={intl.formatMessage(muted ? messages.unmute : messages.mute)} className='player-button' onClick={this.toggleMute}><Icon src={muted ? require('@tabler/icons/icons/volume-3.svg') : require('@tabler/icons/icons/volume.svg')} /></button>

              <div className={classNames('video-player__volume', { active: this.state.hovered })} onMouseDown={this.handleVolumeMouseDown} ref={this.setVolumeRef}>
                <div className='video-player__volume__current' style={{ width: `${volume * 100}%` }} />
                <span
                  className={classNames('video-player__volume__handle')}
                  tabIndex='0'
                  style={{ left: `${volume * 100}%` }}
                />
              </div>

              {(detailed || fullscreen) && (
                <span>
                  <span className='video-player__time-current'>{formatTime(currentTime)}</span>
                  <span className='video-player__time-sep'>/</span>
                  <span className='video-player__time-total'>{formatTime(duration)}</span>
                </span>
              )}

              {link && <span className='video-player__link'>{link}</span>}
            </div>

            <div className='video-player__buttons right'>
              {(sensitive && !onCloseVideo) && <button type='button' title={intl.formatMessage(messages.hide)} aria-label={intl.formatMessage(messages.hide)} className='player-button' onClick={this.toggleReveal}><Icon src={require('@tabler/icons/icons/eye-off.svg')} /></button>}
              {(!fullscreen && onOpenVideo) && <button type='button' title={intl.formatMessage(messages.expand)} aria-label={intl.formatMessage(messages.expand)} className='player-button' onClick={this.handleOpenVideo}><Icon src={require('@tabler/icons/icons/maximize.svg')} /></button>}
              {/* onCloseVideo && <button type='button' title={intl.formatMessage(messages.close)} aria-label={intl.formatMessage(messages.close)} className='player-button' onClick={this.handleCloseVideo}><Icon src={require('@tabler/icons/icons/x.svg')} /></button> */}
              <button type='button' title={intl.formatMessage(fullscreen ? messages.exit_fullscreen : messages.fullscreen)} aria-label={intl.formatMessage(fullscreen ? messages.exit_fullscreen : messages.fullscreen)} className='player-button' onClick={this.toggleFullscreen}><Icon src={fullscreen ? require('@tabler/icons/icons/arrows-minimize.svg') : require('@tabler/icons/icons/arrows-maximize.svg')} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
