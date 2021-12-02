/**
 * iOS style loading spinner.
 * It's mostly CSS, adapted from: https://loading.io/css/
 */
import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 30 }) => (
  <div class='lds-spinner' style={{ width: size, height: size }}>
    {Array(12).fill().map(i => (
      <div />
    ))}
  </div>
);

LoadingSpinner.propTypes = {
  size: PropTypes.number,
};

export default LoadingSpinner;
