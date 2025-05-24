
import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteErrorBoundary } from '@/components/error-boundaries';
import { LandingPageSkeleton } from '@/components/landing/LandingPageSkeleton';
import { AuthSkeleton } from '@/components/auth/AuthSkeleton';
import { DashboardSkeleton } from '@/components/loading/DashboardSkeleton';
import { ProfileSkeleton } from '@/components/loading/ProfileSkeleton';

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
    
    if (route.includes('forgot') || route.includes('password')) {
      return <AuthSkeleton type="login" />;
    }
    
    if (route.includes('dashboard')) {
      return <DashboardSkeleton />;
    }
    
    if (route.includes('profile')) {
      return <ProfileSkeleton />;
    }
    
    if (route.includes('groups')) {
      return (
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg border p-6">
                  <div className="space-y-4">
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Enhanced default fallback
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="space-y-4">
            <LoadingSpinner size="lg" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Loading {routeName}...</p>
              <div className="h-1 w-48 mx-auto bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
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
