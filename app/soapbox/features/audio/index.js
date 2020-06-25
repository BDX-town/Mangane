import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { is } from 'immutable';
import { throttle } from 'lodash';
import classNames from 'classnames';
import Icon from 'soapbox/components/icon';
import { getSettings } from 'soapbox/actions/settings';

const messages = defineMessages({
  play: { id: 'audio.play', defaultMessage: 'Play' },
  pause: { id: 'audio.pause', defaultMessage: 'Pause' },
  mute: { id: 'audio.mute', defaultMessage: 'Mute' },
  unmute: { id: 'audio.unmute', defaultMessage: 'Unmute' },
  hide: { id: 'audio.hide', defaultMessage: 'Hide audio' },
  expand: { id: 'audio.expand', defaultMessage: 'Expand audio' },
  close: { id: 'audio.close', defaultMessage: 'Close audio' },
});

const formatTime = secondsNum => {
  let hours   = Math.floor(secondsNum / 3600);
  let minutes = Math.floor((secondsNum - (hours * 3600)) / 60);
  let seconds = secondsNum - (hours * 3600) - (minutes * 60);

  if (hours   < 10) hours   = '0' + hours;
  if (minutes < 10 && hours >= 1) minutes = '0' + minutes;
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

const mapStateToProps = state => ({
  displayMedia: getSettings(state).get('displayMedia'),
});

export default @connect(mapStateToProps)
@injectIntl
class Audio extends React.PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    sensitive: PropTypes.bool,
    startTime: PropTypes.number,
    detailed: PropTypes.bool,
    inline: PropTypes.bool,
    cacheWidth: PropTypes.func,
    visible: PropTypes.bool,
    onToggleVisibility: PropTypes.func,
    intl: PropTypes.object.isRequired,
    link: PropTypes.node,
    displayMedia: PropTypes.string,
  };

  state = {
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    paused: true,
    dragging: false,
    muted: false,
    revealed: this.props.visible !== undefined ? this.props.visible : (this.props.displayMedia !== 'hide_all' && !this.props.sensitive || this.props.displayMedia === 'show_all'),
  };

  // hard coded in components.scss
  // any way to get ::before values programatically?
  volWidth = 50;
  volOffset = 85;
  volHandleOffset = v => {
    const offset = v * this.volWidth + this.volOffset;
    return (offset > 125) ? 125 : offset;
  }

  setPlayerRef = c => {
    this.player = c;

    if (c) {
      if (this.props.cacheWidth) this.props.cacheWidth(this.player.offsetWidth);
      this.setState({
        containerWidth: c.offsetWidth,
      });
    }
  }

  setAudioRef = c => {
    this.audio = c;

    if (this.audio) {
      this.setState({ volume: this.audio.volume, muted: this.audio.muted });
    }
  }

  setSeekRef = c => {
    this.seek = c;
  }

  setVolumeRef = c => {
    this.volume = c;
  }

  setCanvasRef = c => {
    this.canvas = c;
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
      currentTime: Math.floor(this.audio.currentTime),
      duration: Math.floor(this.audio.duration),
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
    const rect = this.volume.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.volWidth; //x position within the element.

    if(!isNaN(x)) {
      var slideamt = x;
      if(x > 1) {
        slideamt = 1;
      } else if(x < 0) {
        slideamt = 0;
      }
      this.audio.volume = slideamt;
      this.setState({ volume: slideamt });
    }
  }, 60);

  handleMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('mouseup', this.handleMouseUp, true);
    document.addEventListener('touchmove', this.handleMouseMove, true);
    document.addEventListener('touchend', this.handleMouseUp, true);

    this.setState({ dragging: true });
    this.audio.pause();
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
    this.audio.play();
  }

  handleMouseMove = throttle(e => {
    const { x } = getPointerPosition(this.seek, e);
    const currentTime = Math.floor(this.audio.duration * x);

    if (!isNaN(currentTime)) {
      this.audio.currentTime = currentTime;
      this.setState({ currentTime });
    }
  }, 60);

  togglePlay = () => {
    if (this.state.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.visible, this.props.visible) && nextProps.visible !== undefined) {
      this.setState({ revealed: nextProps.visible });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.revealed && !this.state.revealed && this.audio) {
      this.audio.pause();
    }
  }

  toggleMute = () => {
    this.audio.muted = !this.audio.muted;
    this.setState({ muted: this.audio.muted });
  }

  toggleReveal = () => {
    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility();
    } else {
      this.setState({ revealed: !this.state.revealed });
    }
  }

  handleLoadedData = () => {
    if (this.props.startTime) {
      this.audio.currentTime = this.props.startTime;
      this.audio.play();
    }
  }

  handleProgress = () => {
    if (this.audio.buffered.length > 0) {
      this.setState({ buffer: this.audio.buffered.end(0) / this.audio.duration * 100 });
    }
  }

  handleVolumeChange = () => {
    this.setState({ volume: this.audio.volume, muted: this.audio.muted });
  }

  getPreload = () => {
    const { startTime, detailed } = this.props;
    const { dragging } = this.state;

    if (startTime || dragging) {
      return 'auto';
    } else if (detailed) {
      return 'metadata';
    } else {
      return 'none';
    }
  }

  render() {
    const { src, inline, intl, alt, detailed, sensitive, link } = this.props;
    const { currentTime, duration, volume, buffer, dragging, paused, muted, revealed } = this.state;
    const progress = (currentTime / duration) * 100;

    const volumeWidth = (muted) ? 0 : volume * this.volWidth;
    const volumeHandleLoc = (muted) ? this.volHandleOffset(0) : this.volHandleOffset(volume);
    const playerStyle = {};

    let warning;

    if (sensitive) {
      warning = <FormattedMessage id='status.sensitive_warning' defaultMessage='Sensitive content' />;
    } else {
      warning = <FormattedMessage id='status.media_hidden' defaultMessage='Media hidden' />;
    }

    return (
      <div
        role='menuitem'
        className={classNames('audio-player', { inactive: !revealed, detailed, inline: inline })}
        style={playerStyle}
        ref={this.setPlayerRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClickRoot}
        tabIndex={0}
      >
        <canvas width={32} height={32} ref={this.setCanvasRef} className={classNames('media-gallery__preview', { 'media-gallery__preview--hidden': revealed })} />

        {revealed && <audio
          ref={this.setAudioRef}
          src={src}
          // preload={this.getPreload()}
          role='button'
          tabIndex='0'
          aria-label={alt}
          title={alt}
          volume={volume}
          onClick={this.togglePlay}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onTimeUpdate={this.handleTimeUpdate}
          onLoadedData={this.handleLoadedData}
          onProgress={this.handleProgress}
          onVolumeChange={this.handleVolumeChange}
        />}

        <div className={classNames('spoiler-button', { 'spoiler-button--hidden': revealed })}>
          <button type='button' className='spoiler-button__overlay' onClick={this.toggleReveal}>
            <span className='spoiler-button__overlay__label'>{warning}</span>
          </button>
        </div>

        <div className={classNames('audio-player__controls')}>
          <div className='audio-player__seek' onMouseDown={this.handleMouseDown} ref={this.setSeekRef}>
            <div className='audio-player__seek__buffer' style={{ width: `${buffer}%` }} />
            <div className='audio-player__seek__progress' style={{ width: `${progress}%` }} />

            <span
              className={classNames('audio-player__seek__handle', { active: dragging })}
              tabIndex='0'
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className='audio-player__buttons-bar'>
            <div className='audio-player__buttons left'>
              <button type='button' aria-label={intl.formatMessage(paused ? messages.play : messages.pause)} onClick={this.togglePlay}><Icon id={paused ? 'play' : 'pause'} fixedWidth /></button>
              <button type='button' aria-label={intl.formatMessage(muted ? messages.unmute : messages.mute)} onClick={this.toggleMute}><Icon id={muted ? 'volume-off' : 'volume-up'} fixedWidth /></button>

              <div className='audio-player__volume' onMouseDown={this.handleVolumeMouseDown} ref={this.setVolumeRef}>
                <div className='audio-player__volume__current' style={{ width: `${volumeWidth}px` }} />
                <span
                  className={classNames('audio-player__volume__handle')}
                  tabIndex='0'
                  style={{ left: `${volumeHandleLoc}px` }}
                />
              </div>

              <span>
                <span className='audio-player__time-current'>{formatTime(currentTime)}</span>
                <span className='audio-player__time-sep'>/</span>
                <span className='audio-player__time-total'>{formatTime(duration)}</span>
              </span>

              {link && <span className='audio-player__link'>{link}</span>}
            </div>

            <div className='audio-player__buttons right'>
              {<button type='button' aria-label={intl.formatMessage(messages.hide)} onClick={this.toggleReveal}><Icon id='eye-slash' fixedWidth /></button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

}
