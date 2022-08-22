import classNames from 'classnames';
import React from 'react';

interface IBanner {
  theme: 'frosted' | 'opaque',
  children: React.ReactNode,
  className?: string,
}

/** Displays a sticky full-width banner at the bottom of the screen. */
const Banner: React.FC<IBanner> = ({ theme, children, className }) => {
  return (
    <div
      data-testid='banner'
      className={classNames('fixed bottom-0 left-0 right-0 py-8 z-50', {
        'backdrop-blur bg-primary-900/80': theme === 'frosted',
        'bg-white dark:bg-slate-800 text-black dark:text-white shadow-3xl dark:shadow-inset': theme === 'opaque',
      }, className)}
    >
      <div className='max-w-4xl mx-auto px-4'>
        {children}
      </div>
    </div>
  );
};

export default Banner;
