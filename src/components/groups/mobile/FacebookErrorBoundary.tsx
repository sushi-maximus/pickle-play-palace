
import React, { ReactNode, ErrorInfo } from "react";
import { FacebookErrorFallback } from "./FacebookErrorFallback";

interface FacebookErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallback?: (props: { error: Error; resetError: () => void }) => ReactNode;
}

interface FacebookErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class FacebookErrorBoundary extends React.Component<
  FacebookErrorBoundaryProps,
  FacebookErrorBoundaryState
> {
  constructor(props: FacebookErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): FacebookErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Facebook Error Boundary caught an error:", error, errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.resetError
        });
      }

      return (
        <FacebookErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}
