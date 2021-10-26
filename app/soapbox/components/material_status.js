/**
 * MaterialStatus: like a Status, but with gaps and rounded corners.
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class MaterialStatus extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    hidden: PropTypes.bool,
  }

  render() {
    // Performance: when hidden, don't render the wrapper divs
    if (this.props.hidden) {
      return this.props.children;
    }

    return (
      <div className='material-status' tabIndex={-1}>
        <div className='material-status__status focusable' tabIndex={0}>
          {this.props.children}
        </div>
      </div>
    );
  }

}
