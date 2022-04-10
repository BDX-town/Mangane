/**
 * SvgIcon: abstact component to render SVG icons.
 * @module soapbox/components/svg_icon
 * @see soapbox/components/icon
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import InlineSVG from 'react-inlinesvg'; // eslint-disable-line no-restricted-imports

export default class SvgIcon extends React.PureComponent {

  static propTypes = {
    src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
  };

  render() {
    const { src, className, alt, ...other } = this.props;

    return (
      <div
        className={classNames('svg-icon', className)}
        {...other}
      >
        <InlineSVG src={src} title={alt} loader={<></>} />
      </div>
    );
  }

}
