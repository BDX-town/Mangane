import React from 'react';

interface ICheckbox extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'id' | 'name' | 'onChange' | 'checked' | 'required'> { }

const Checkbox = React.forwardRef<HTMLInputElement, ICheckbox>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type='checkbox'
      className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
    />
  );
});

export default Checkbox;
