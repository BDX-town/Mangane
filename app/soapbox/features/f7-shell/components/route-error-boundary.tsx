/**
 * Phase 3D — Route-level error boundary for the F7 shell.
 *
 * Catches render errors in route content and displays a recovery UI
 * with retry and home navigation actions. Does not catch errors in
 * the shell itself (those are handled by the app-level ErrorBoundary).
 */
import React from 'react';
import { useHistory } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface RouteErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
  onGoHome: () => void;
}

/** Fallback UI displayed when a route component throws. */
const RouteErrorFallback: React.FC<RouteErrorFallbackProps> = ({ error, onRetry, onGoHome }) => (
  <div className='f7-shell__error' role='alert'>
    <div className='f7-shell__error-content'>
      <h2 className='f7-shell__error-title'>Something went wrong</h2>
      <p className='f7-shell__error-message'>
        {error?.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <div className='f7-shell__error-actions'>
        <button
          type='button'
          className='ds-button'
          onClick={onRetry}
        >
          Try again
        </button>
        <button
          type='button'
          className='ds-button ds-button--secondary'
          onClick={onGoHome}
        >
          Go home
        </button>
      </div>
    </div>
  </div>
);

/**
 * Class component error boundary (React requires class for getDerivedStateFromError).
 */
class RouteErrorBoundaryInner extends React.Component<
  { children: React.ReactNode; fallback: React.FC<RouteErrorFallbackProps> },
  ErrorBoundaryState
> {

  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;
      return (
        <Fallback
          error={this.state.error}
          onRetry={this.handleRetry}
          onGoHome={() => {/* handled by wrapper */}}
        />
      );
    }
    return this.props.children;
  }

}

/**
 * Route-level error boundary with navigation-aware recovery.
 */
const RouteErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const history = useHistory();

  const FallbackWithNav: React.FC<RouteErrorFallbackProps> = ({ error, onRetry }) => (
    <RouteErrorFallback
      error={error}
      onRetry={onRetry}
      onGoHome={() => history.push('/')}
    />
  );

  return (
    <RouteErrorBoundaryInner fallback={FallbackWithNav}>
      {children}
    </RouteErrorBoundaryInner>
  );
};

export default RouteErrorBoundary;
