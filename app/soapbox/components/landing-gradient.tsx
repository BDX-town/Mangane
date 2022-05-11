import React from 'react';

/** Fullscreen gradient used as a backdrop to public pages. */
const LandingGradient: React.FC = () => (
  <div className='fixed h-screen w-full bg-gradient-to-tr from-primary-50 dark:from-slate-900/50 via-white dark:via-slate-900 to-gradient-end/10 dark:to-slate-900/50' />
);

export default LandingGradient;
