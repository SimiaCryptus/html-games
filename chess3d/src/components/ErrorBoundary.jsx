import React, {Component} from 'react';

// Helper function to safely stringify objects
function safeStringify(obj, indent = 2) {
    // ... (unchanged)
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                return '[Circular]';
            }
            cache.add(value);
        }
        return value;
    }, indent);
}

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            isProduction: process.env.NODE_ENV === 'production'
        };
        console.log('[ErrorBoundary] Constructor: Initialized with props:', safeStringify(props));
        console.log('[ErrorBoundary] Constructor: Initial state:', safeStringify(this.state));
    }

    // ... (other methods unchanged)
    static getDerivedStateFromError(error) {
        console.error('[ErrorBoundary] getDerivedStateFromError: Caught an error:', error.message);
        console.error('[ErrorBoundary] getDerivedStateFromError: Error stack:', error.stack);
        // Update state so the next render will show the fallback UI.
        return {hasError: true, error};
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary] componentDidCatch: Caught an error:', error.message);
        console.error('[ErrorBoundary] componentDidCatch: Error stack:', error.stack);
        console.error('[ErrorBoundary] componentDidCatch: Component stack:', errorInfo.componentStack);
        this.setState({errorInfo});
        console.log('[ErrorBoundary] componentDidCatch: Updated state:', safeStringify(this.state));
        if (this.props.onError) {
            console.log('[ErrorBoundary] componentDidCatch: Calling onError prop function');
            this.props.onError(error);
        } else {
            console.log('[ErrorBoundary] componentDidCatch: No onError prop function provided');
        }
        // Log the error to a logging service
        this.logErrorToService(error, errorInfo);
    }

    logErrorToService(error, errorInfo) {
        // TODO: Implement actual error logging service
        console.log('[ErrorBoundary] Logging error to service:', {
            error: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });
    }

    resetErrorBoundary = (callback) => {
        console.log('[ErrorBoundary] Resetting error state');
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        }, () => {
            console.log('[ErrorBoundary] Error state reset complete');
            if (typeof callback === 'function') {
                callback();
            }
            if (typeof this.props.onReset === 'function') {
                this.props.onReset();
            }
        });
    }

    render() {
        if (this.state.hasError) {
            console.warn('[ErrorBoundary] render: Rendering fallback UI due to error');
            console.log('[ErrorBoundary] render: Current error state:', safeStringify(this.state));
            const errorMessage = this.state.isProduction
                ? 'Oops! Something went wrong.'
                : `An error occurred: ${this.state.error && this.state.error.message}`;

            return (
                <div>
                    <h2>{errorMessage}</h2>
                    {!this.state.isProduction && (
                        <details style={{whiteSpace: 'pre-wrap'}}>
                            <summary>Error Details</summary>
                            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
                            <br/>
                            <p>
                                <strong>Component
                                    Stack:</strong> {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </p>
                            <br/>
                            <p>
                                <strong>Error Stack:</strong> {this.state.error && this.state.error.stack}
                            </p>
                        </details>
                    )}
                    <button onClick={() => this.resetErrorBoundary()}>Try Again</button>
                </div>
            );
        }

        console.log('[ErrorBoundary] render: Rendering children components');
        return this.props.fallback ? this.props.fallback(this.resetErrorBoundary) : this.props.children;
    }
}

console.log('[ErrorBoundary] Module loaded');

export default ErrorBoundary;