import React from 'react';

import LandingGradient from 'soapbox/components/landing-gradient';
import { Spinner } from 'soapbox/components/ui';

/** Fullscreen loading indicator. */
const LoadingScreen: React.FC = () => {
  return (
    <div className='fixed h-screen w-screen'>
      <LandingGradient />

      <div className='fixed d-screen w-screen flex items-center justify-center z-10'>
        <div className='p-4'>
          <Spinner size={40} withText={false} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
