import React from 'react';

import PlaceholderStatus from './placeholder_status';

export default class PlaceholderMaterialStatus extends React.Component {

  render() {
    return (
      <div className='material-status' tabIndex={-1} aria-hidden>
        <div className='material-status__status' tabIndex={0}>
          <PlaceholderStatus {...this.props} focusable={false} />
        </div>
      </div>
    );
  }

}
