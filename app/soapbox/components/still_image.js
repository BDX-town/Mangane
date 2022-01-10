import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';

const mapStateToProps = state => ({
  autoPlayGif: getSettings(state).get('autoPlayGif'),
});

export default @connect(mapStateToProps)
class StillImage extends React.PureComponent {

  static propTypes = {
    alt: PropTypes.string,
    autoPlayGif: PropTypes.bool.isRequired,
    className: PropTypes.node,
    src: PropTypes.string.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    alt: '',
    className: '',
    style: {},
  }

  hoverToPlay() {
    const { autoPlayGif, src } = this.props;
    return src && !autoPlayGif && (src.endsWith('.gif') || src.startsWith('blob:'));
  }

  setCanvasRef = c => {
    this.canvas = c;
  }

  setImageRef = i => {
    this.img = i;
  }

  handleImageLoad = () => {
    if (this.hoverToPlay()) {
      const img = this.img;
      const canvas = this.canvas;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
    }
  }

  render() {
    const { alt, className, src, style } = this.props;
    const hoverToPlay = this.hoverToPlay();

    return (
      <div className={classNames(className, 'still-image', { 'still-image--play-on-hover': hoverToPlay })} style={style}>
        <img src={src} alt={alt} ref={this.setImageRef} onLoad={this.handleImageLoad} />
        {hoverToPlay && <canvas ref={this.setCanvasRef} />}
      </div>
    );
  }

}
