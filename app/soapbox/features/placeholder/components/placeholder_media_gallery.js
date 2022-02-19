import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

export default class PlaceholderMediaGallery extends React.Component {

  static propTypes = {
    media: ImmutablePropTypes.map.isRequired,
    defaultWidth: PropTypes.number,
  }

  state = {
    width: this.props.defaultWidth,
  };

  handleRef = (node) => {
    if (node) {
      this.setState({
        width: node.offsetWidth,
      });
    }
  }

  getSizeData = size => {
    const { defaultWidth } = this.props;
    const width = this.state.width || defaultWidth;

    const style = {};
    let itemsDimensions = [];

    if (size === 1) {
      style.height = width * 9 / 16;

      itemsDimensions = [
        { w: '100%', h: '100%' },
      ];
    } else if (size === 2) {
      style.height = width / 2;

      itemsDimensions = [
        { w: '50%', h: '100%', r: '2px' },
        { w: '50%', h: '100%', l: '2px' },
      ];
    } else if (size === 3) {
      style.height = width;

      itemsDimensions = [
        { w: '50%', h: '50%', b: '2px', r: '2px' },
        { w: '50%', h: '50%', b: '2px', l: '2px' },
        { w: '100%', h: '50%', t: '2px' },
      ];
    } else if (size >= 4) {
      style.height = width;

      itemsDimensions = [
        { w: '50%', h: '50%', b: '2px', r: '2px' },
        { w: '50%', h: '50%', b: '2px', l: '2px' },
        { w: '50%', h: '50%', t: '2px', r: '2px' },
        { w: '50%', h: '50%', t: '2px', l: '2px' },
      ];
    }

    return ImmutableMap({
      style,
      itemsDimensions,
      size,
      width,
    });
  }

  renderItem = (dimensions, i) => {
    const width = dimensions.w;
    const height = dimensions.h;
    const top = dimensions.t || 'auto';
    const right = dimensions.r || 'auto';
    const bottom = dimensions.b || 'auto';
    const left = dimensions.l || 'auto';
    const float = dimensions.float || 'left';
    const position = dimensions.pos || 'relative';

    return <div key={i} className='media-gallery__item' style={{ position, float, left, top, right, bottom, height, width }} />;
  }

  render() {
    const { media } = this.props;
    const sizeData = this.getSizeData(media.size);

    return (
      <div className='media-gallery media-gallery--placeholder' style={sizeData.get('style')} ref={this.handleRef}>
        {media.take(4).map((_, i) => this.renderItem(sizeData.get('itemsDimensions')[i], i))}
      </div>
    );
  }

}
