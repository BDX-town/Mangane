import classNames from 'classnames';
import React from 'react';

interface IBackgroundShapes {
  /** Whether the shapes should be absolute positioned or fixed. */
  position?: 'fixed' | 'absolute',
}

/** Gradient that appears in the background of the UI. */
const BackgroundShapes: React.FC<IBackgroundShapes> = ({ position = 'fixed' }) => (
  <div className={classNames(position, 'top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none')}>
    <div className='w-screen h-screen bg-gradient-sm lg:bg-gradient-lg' />
  </div>
);

export default BackgroundShapes;
