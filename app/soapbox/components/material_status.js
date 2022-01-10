/**
 * MaterialStatus: like a Status, but with gaps and rounded corners.
 */

import PropTypes from 'prop-types';
import React from 'react';
import StatusContainer from 'soapbox/containers/status_container';

export default class MaterialStatus extends React.Component {

  static propTypes = {
    hidden: PropTypes.bool,
  }

  render() {
    // Performance: when hidden, don't render the wrapper divs
    if (this.props.hidden) {
      return <StatusContainer {...this.props} />;
    }

    return (
      <div className='material-status' tabIndex={-1}>
        <div className='material-status__status focusable' tabIndex={0}>
          <StatusContainer {...this.props} focusable={false} />
        </div>
      </div>
    );
  }

}
