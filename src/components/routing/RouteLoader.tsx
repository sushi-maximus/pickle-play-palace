
import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteErrorBoundary } from '@/components/error-boundaries';

interface RouteLoaderProps {
  children: ReactNode;
  routeName: string;
  fallback?: ReactNode;
}

export const RouteLoader = ({ 
  children, 
  routeName, 
  fallback 
}: RouteLoaderProps) => {
  const defaultFallback = (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Loading {routeName}...</p>
      </div>
    </div>
  );

  return (
    <RouteErrorBoundary routeName={routeName}>
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
};
