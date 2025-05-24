
import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteErrorBoundary } from '@/components/error-boundaries';
import { LandingPageSkeleton } from '@/components/landing/LandingPageSkeleton';
import { AuthSkeleton } from '@/components/auth/AuthSkeleton';

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
  // Create specific skeletons for different page types
  const getSkeletonForRoute = (routeName: string) => {
    const route = routeName.toLowerCase();
    
    if (route.includes('landing') || route.includes('index')) {
      return <LandingPageSkeleton />;
    }
    
    if (route.includes('login')) {
      return <AuthSkeleton type="login" />;
    }
    
    if (route.includes('signup')) {
      return <AuthSkeleton type="signup" />;
    }
    
    if (route.includes('forgot password')) {
      return <AuthSkeleton type="login" />;
    }
    
    // Default fallback for other pages
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading {routeName}...</p>
        </div>
      </div>
    );
  };

  const skeletonFallback = fallback || getSkeletonForRoute(routeName);

  return (
    <RouteErrorBoundary routeName={routeName}>
      <Suspense fallback={skeletonFallback}>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
};
