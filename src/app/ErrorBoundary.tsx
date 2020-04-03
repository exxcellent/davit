import React from 'react';

// Property Interface for ErrorBoundary
interface ErrorBoundaryProps {
children?: any;
onError?: (error: Error, componentStack: string) => void;
}

class ErrorBoundary extends React.Component <ErrorBoundaryProps, any>{
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.    
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, errorInfo);
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }

}