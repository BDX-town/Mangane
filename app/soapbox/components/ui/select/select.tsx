import * as React from 'react';

interface ISelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: Iterable<React.ReactNode>,
}

/** Multiple-select dropdown. */
const Select = React.forwardRef<HTMLSelectElement, ISelect>((props, ref) => {
  const { children, className, ...filteredProps } = props;

  return (
    <select
      ref={ref}
      className={`w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-gray-100 dark:ring-1 dark:ring-gray-800 dark:focus:ring-primary-500 dark:focus:border-primary-500 sm:text-sm rounded-md disabled:opacity-50 ${className}`}
      {...filteredProps}
    >
      {children}
    </select>
  );
});

export default Select;
