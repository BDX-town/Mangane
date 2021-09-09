/**
 * Icon: abstract icon class that can render icons from multiple sets.
 * @module soapbox/components/icon
 * @see soapbox/components/fork_awesome_icon
 */

import React from 'react';
import PropTypes from 'prop-types';
import ForkAwesomeIcon from './fork_awesome_icon';

export default class Icon extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    iconset: PropTypes.string,
    className: PropTypes.string,
    fixedWidth: PropTypes.bool,
  };

  render() {
    const { iconset, ...rest } = this.props;

    switch(iconset) {
    default:
      return <ForkAwesomeIcon {...rest} />;
    }
  }

}
