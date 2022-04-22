import PropTypes from 'prop-types';
import React from 'react';

import { isIOS } from 'soapbox/is_mobile';

export default class ExtendedVideoPlayer extends React.PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    time: PropTypes.number,
    controls: PropTypes.bool.isRequired,
    muted: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
  };

  handleLoadedData = () => {
    if (this.props.time) {
      this.video.currentTime = this.props.time;
    }
  }

  componentDidMount() {
    this.video.addEventListener('loadeddata', this.handleLoadedData);
  }

  componentWillUnmount() {
    this.video.removeEventListener('loadeddata', this.handleLoadedData);
  }

  setRef = (c) => {
    this.video = c;
  }

  handleClick = e => {
    e.stopPropagation();
    const handler = this.props.onClick;
    if (handler) handler();
  }

  render() {
    const { src, muted, controls, alt } = this.props;
    const conditionalAttributes = {};
    if (isIOS()) {
      conditionalAttributes.playsInline = '1';
    }

    return (
      <div className='extended-video-player'>
        <video
          ref={this.setRef}
          src={src}
          autoPlay
          role='button'
          tabIndex='0'
          aria-label={alt}
          title={alt}
          muted={muted}
          controls={controls}
          loop={!controls}
          onClick={this.handleClick}
          {...conditionalAttributes}
        />
      </div>
    );
  }

}
