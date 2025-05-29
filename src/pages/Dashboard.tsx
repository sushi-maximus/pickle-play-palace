
import { useEffect, useRef } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { AreasOfFocusCard } from "@/components/dashboard/AreasOfFocusCard";
import { RegisteredEventsCard } from "@/components/dashboard/RegisteredEventsCard";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton";
import { useConditionalPullToRefresh } from "@/components/dashboard/hooks/useConditionalPullToRefresh";

const Dashboard = () => {
  const { isLoading, user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Only enable pull-to-refresh when user is authenticated
  const { pullDistance, isRefreshing, isPulling, bindToElement } = useConditionalPullToRefresh({
    enabled: !isLoading && !!user
  });

  // Only bind pull-to-refresh when user exists and container is available
  useEffect(() => {
    if (scrollContainerRef.current && user && !isLoading) {
      bindToElement(scrollContainerRef.current);
    }
  }, [bindToElement, user, isLoading]);

  // Show loading state while authentication is being resolved
  if (isLoading || !user) {
    return (
      <RouteErrorBoundary routeName="Dashboard">
        <AppLayout title="Dashboard">
          <DashboardSkeleton />
        </AppLayout>
      </RouteErrorBoundary>
    );
  }

  // Render authenticated dashboard content
  return (
    <RouteErrorBoundary routeName="Dashboard">
      <AppLayout title="Dashboard">
        <div 
          ref={scrollContainerRef}
          className="space-y-6 animate-fade-in relative"
          style={{
            transform: isPulling ? `translateY(${pullDistance}px)` : 'none',
            transition: isPulling ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {/* Pull-to-refresh indicator */}
          {(isPulling || isRefreshing) && (
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
              style={{ transform: `translateX(-50%) translateY(${Math.max(pullDistance - 80, -80)}px)` }}
            >
              <div className="bg-white rounded-full p-2 shadow-lg border">
                <div className={`w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full ${isRefreshing ? 'animate-spin' : ''}`} />
              </div>
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-slate-600">Welcome to your dashboard!</p>
          </div>
          
          {/* RegisteredEventsCard above AreasOfFocusCard (as per user decision A7) */}
          <RegisteredEventsCard />
          
          <AreasOfFocusCard />
        </div>
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Dashboard;
