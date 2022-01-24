import PropTypes from 'prop-types';
import React from 'react';

const ColumnSubheading = ({ text }) => {
  return (
    <div className='column-subheading'>
      {text}
    </div>
  );
};

ColumnSubheading.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ColumnSubheading;
