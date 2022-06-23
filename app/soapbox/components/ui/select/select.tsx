import * as React from 'react';

interface ISelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: Iterable<React.ReactNode>,
}

/** Multiple-select dropdown. */
const Select = React.forwardRef<HTMLSelectElement, ISelect>((props, ref) => {
  const { children, ...filteredProps } = props;

  return (
    <select
      ref={ref}
      className='w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-white sm:text-sm rounded-md disabled:opacity-50'
      {...filteredProps}
    >
      {children}
    </select>
  );
});

export default Select;
