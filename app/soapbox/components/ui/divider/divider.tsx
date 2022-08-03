import React from 'react';

interface IDivider {
  text?: string
}

/** Divider */
const Divider = ({ text }: IDivider) => (
  <div className='relative' data-testid='divider'>
    <div className='absolute inset-0 flex items-center' aria-hidden='true'>
      <div className='w-full border-t-2 border-gray-100 dark:border-gray-800 border-solid' />
    </div>

    {text && (
      <div className='relative flex justify-center'>
        <span className='px-2 bg-white text-gray-400' data-testid='divider-text'>{text}</span>
      </div>
    )}
  </div>
);

export default Divider;
