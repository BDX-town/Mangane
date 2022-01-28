/**
 * SvgIcon: abstact component to render SVG icons.
 * @module soapbox/components/svg_icon
 * @see soapbox/components/icon
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import InlineSVG from 'react-inlinesvg';

export default class SvgIcon extends React.PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  render() {
    const { src, className } = this.props;

    return (
      <div className={classNames('svg-icon', className)}>
        <InlineSVG src={src} />
      </div>
    );
  }

}
