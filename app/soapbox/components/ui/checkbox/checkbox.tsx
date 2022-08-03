import React from 'react';

interface ICheckbox extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'id' | 'name' | 'onChange' | 'checked' | 'required'> { }

/** A pretty checkbox input. */
const Checkbox = React.forwardRef<HTMLInputElement, ICheckbox>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type='checkbox'
      className='border-2 dark:bg-gray-900 dark:border-gray-800 focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded'
    />
  );
});

export default Checkbox;
