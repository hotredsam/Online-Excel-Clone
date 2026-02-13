import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('GlassSheet error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="error-boundary" role="alert" aria-labelledby="error-boundary-title" aria-describedby="error-boundary-desc">
          <h2 id="error-boundary-title" className="glass-title">Something went wrong</h2>
          <p id="error-boundary-desc" className="error-boundary-message glass-body">{this.state.error.message}</p>
          <button type="button" className="glass-btn glass-btn-primary" onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
