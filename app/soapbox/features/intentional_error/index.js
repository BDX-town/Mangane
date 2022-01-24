import React from 'react';

/**
 * IntentionalError:
 * For testing logging/monitoring & previewing ErrorBoundary design.
 */
export default class IntentionalError extends React.Component {

  render() {
    throw 'This error is intentional.';
  }

}
