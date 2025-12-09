import React from 'react';
import logger from '../services/logger';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, unknown>>,
  State
> {
  constructor(props: React.PropsWithChildren<Record<string, unknown>>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log concise error with meta
    logger.error('React error boundary caught', {
      error: error.message,
      info: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      // Render a simple fallback UI
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
