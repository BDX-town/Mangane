import React from 'react';

const Sonar = () => (
  <div className='relative'>
    <div className='relative w-48 h-48 bg-white rounded-full'>
      <div className='animate-sonar-scale-4 absolute top-0 left-0 w-full h-full rounded-full bg-primary-600/25 opacity-0 -z-[1] pointer-events-none' />
      <div className='animate-sonar-scale-3 absolute top-0 left-0 w-full h-full rounded-full bg-primary-600/25 opacity-0 -z-[1] pointer-events-none' />
      <div className='animate-sonar-scale-2 absolute top-0 left-0 w-full h-full rounded-full bg-primary-600/25 opacity-0 -z-[1] pointer-events-none' />
      <div className='animate-sonar-scale-1 absolute top-0 left-0 w-full h-full rounded-full bg-primary-600/25 opacity-0 -z-[1] pointer-events-none' />
    </div>
  </div>
);

export default Sonar;
