import PropTypes from 'prop-types';
import * as React from 'react';

const Select = React.forwardRef((props, ref) => {
  const { children, ...filteredProps } = props;

  return (
    <select
      ref={ref}
      className='pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
      {...filteredProps}
    >
      {children}
    </select>
  );
});

Select.propTypes = {
  children: PropTypes.node,
};

export default Select;
