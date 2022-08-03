import React, { forwardRef } from 'react';

interface IFileInput extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'required' | 'disabled' | 'name' | 'accept'> { }

const FileInput = forwardRef<HTMLInputElement, IFileInput>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type='file'
      className='block w-full text-sm text-gray-800 dark:text-gray-200 file:cursor-pointer file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:text-xs file:leading-4 file:font-medium file:border-gray-200 file:border file:border-solid file:bg-white file:text-gray-700 hover:file:bg-gray-100 dark:file:border-gray-800 dark:file:bg-gray-900 dark:file:hover:bg-gray-800 dark:file:text-gray-500'
    />
  );
});

export default FileInput;
