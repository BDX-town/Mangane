import React from 'react';

import PlaceholderStatus from './placeholder_status';

/** Fake material status to display while data is loading. */
const PlaceholderMaterialStatus: React.FC = () => {
  return (
    <div className='material-status' tabIndex={-1} aria-hidden>
      <div className='material-status__status' tabIndex={0}>
        <PlaceholderStatus />
      </div>
    </div>
  );
};

export default PlaceholderMaterialStatus;
