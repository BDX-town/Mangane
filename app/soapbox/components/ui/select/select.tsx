import * as React from 'react';

/** Multiple-select dropdown. */
const Select = React.forwardRef<HTMLSelectElement>((props, ref) => {
  const { children, ...filteredProps } = props;

  return (
    <select
      ref={ref}
      className='pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 sm:text-sm rounded-md'
      {...filteredProps}
    >
      {children}
    </select>
  );
});

export default Select;
