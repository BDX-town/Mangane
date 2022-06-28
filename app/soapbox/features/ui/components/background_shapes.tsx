import classNames from 'classnames';
import React from 'react';

interface IBackgroundShapes {
  /** Whether the shapes should be absolute positioned or fixed. */
  position?: 'fixed' | 'absolute',
}

/** Gradient that appears in the background of the UI. */
const BackgroundShapes: React.FC<IBackgroundShapes> = ({ position = 'fixed' }) => (
  <div className={classNames(position, 'top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none')}>
    <div className='w-screen h-screen' style={{ background: 'linear-gradient(112deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 20%, rgba(84,72,238,0.1) 30%, rgba(20,156,255,0.1) 70%, rgba(0,0,0,0) 80%, rgba(0,0,0,0) 100%)' }} />
  </div>
);

export default BackgroundShapes;
