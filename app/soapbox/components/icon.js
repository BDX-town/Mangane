/**
 * Icon: abstract icon class that can render icons from multiple sets.
 * @module soapbox/components/icon
 * @see soapbox/components/fork_awesome_icon
 * @see soapbox/components/svg_icon
 */

import PropTypes from 'prop-types';
import React from 'react';

import ForkAwesomeIcon from './fork_awesome_icon';
import SvgIcon from './svg_icon';

export default class Icon extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string,
    src: PropTypes.string,
    className: PropTypes.string,
  };

  render() {
    const { id, src, ...rest } = this.props;

    if (src) {
      return <SvgIcon src={src} {...rest} />;
    } else {
      return <ForkAwesomeIcon id={id} {...rest} />;
    }
  }

}
