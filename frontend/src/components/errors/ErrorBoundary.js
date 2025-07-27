import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Something went wrong
                </h2>
                <p className="text-gray-600 mb-6">
                  We apologize for the inconvenience. Please try refreshing the page.
                </p>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="primary"
                    fullWidth
                  >
                    Refresh Page
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    fullWidth
                  >
                    Go to Homepage
                  </Button>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-6 text-left">
                    <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="bg-gray-100 p-4 rounded text-xs font-mono text-gray-800 overflow-auto max-h-64">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                      </div>
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
