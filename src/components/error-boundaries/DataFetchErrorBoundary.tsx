
import React, { Component, ReactNode } from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logError, isNetworkError } from '@/utils/errorHandling';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class DataFetchErrorBoundaryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, `DataFetchErrorBoundary-${this.props.componentName || 'Unknown'}`);
    this.setState({ error });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      const isNetwork = this.state.error && isNetworkError(this.state.error);
      
      return (
        <Alert variant={isNetwork ? "default" : "destructive"} className="m-3">
          {isNetwork ? <WifiOff className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertDescription className="flex items-center justify-between">
            <span>
              {isNetwork 
                ? "Unable to load data. Please check your connection."
                : `Failed to load ${this.props.componentName || 'data'}. Please try again.`
              }
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className="ml-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export const DataFetchErrorBoundary = ({ children, onRetry, componentName }: Props) => {
  const { isOnline } = useNetworkStatus();
  
  return (
    <DataFetchErrorBoundaryComponent 
      onRetry={onRetry} 
      componentName={componentName}
    >
      {!isOnline && (
        <Alert className="m-3">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Some features may not work properly.
          </AlertDescription>
        </Alert>
      )}
      {children}
    </DataFetchErrorBoundaryComponent>
  );
};
