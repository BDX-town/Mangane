import React from 'react';
import InlineSVG from 'react-inlinesvg';

export default () => (
  <div className='fixed top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none'>
    <div className='flex-none flex justify-center'>
      <InlineSVG src={require('../../../../images/bg-shape.svg')} className='flex-none max-w-none' />
    </div>
  </div>
);
