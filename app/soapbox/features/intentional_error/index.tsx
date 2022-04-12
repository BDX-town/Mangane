import React from 'react';

/**
 * IntentionalError:
 * For testing logging/monitoring & previewing ErrorBoundary design.
 */
const IntentionalError: React.FC = () => {
  throw 'This error is intentional.';
};

export default IntentionalError;
