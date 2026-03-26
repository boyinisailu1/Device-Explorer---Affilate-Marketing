import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    // Log to external error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-gradient-to-br from-gray-900 to-black">
          <div className="w-full max-w-md">
            <div className="glass p-8 rounded-3xl border border-red-500/20 shadow-2xl">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold mb-4 text-red-500">Oops! Something went wrong</h2>
                <p className="text-gray-300 mb-6">We encountered an unexpected error. Please try again or contact support if the problem persists.</p>
                {import.meta.env.DEV && this.state.error && (
                  <div className="mb-6 p-4 bg-black/50 rounded-lg text-left text-xs text-gray-400 overflow-auto max-h-40">
                    <p className="font-bold text-red-400 mb-2">Error Details:</p>
                    <p className="break-words">{this.state.error.toString()}</p>
                  </div>
                )}
                <button
                  onClick={this.handleReset}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-xl font-bold text-white transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
