import React, {Component} from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
        console.log('ErrorBoundary initialized with props:', props);
    }

    static getDerivedStateFromError(error) {
        console.error('ErrorBoundary.getDerivedStateFromError: Caught an error:', error);
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary.componentDidCatch: Caught an error:', error);
        console.error('ErrorBoundary.componentDidCatch: Error info:', errorInfo);
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            console.warn('ErrorBoundary.render: Rendering fallback UI due to error');
            // You can render any custom fallback UI
            return <h2>Something went wrong.</h2>;
        }

        console.log('ErrorBoundary.render: Rendering children components');
        return this.props.children;
    }
}

export default ErrorBoundary;