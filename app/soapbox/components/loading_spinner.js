/**
 * iOS style loading spinner.
 * It's mostly CSS, adapted from: https://loading.io/css/
 */
import PropTypes from 'prop-types';
import React from 'react';

const LoadingSpinner = ({ size = 30 }) => (
  <div className='lds-spinner' style={{ width: size, height: size }}>
    {[...Array(12).keys()].map(i => (
      <div key={i} />
    ))}
  </div>
);

LoadingSpinner.propTypes = {
  size: PropTypes.number,
};

export default LoadingSpinner;
