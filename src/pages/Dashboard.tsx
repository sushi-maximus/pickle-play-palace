
import { AppLayout } from "@/components/layout/AppLayout";
import { AreasOfFocusCard } from "@/components/dashboard/AreasOfFocusCard";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLoading } from "@/components/loading/DashboardLoading";
import { usePerformanceMonitoring } from "@/hooks/performance";

const Dashboard = () => {
  const { isLoading } = useAuth();
  
  // Integrated performance monitoring
  const { 
    metrics, 
    memoryInfo, 
    isHighUsage, 
    pressureInfo 
  } = usePerformanceMonitoring({ isLoading }, {
    componentName: 'Dashboard',
    enabled: process.env.NODE_ENV === 'development',
    trackProps: true,
    renderThreshold: 10,
    memoryAlertThreshold: 75,
    logToConsole: true
  });

  return (
    <RouteErrorBoundary routeName="Dashboard">
      <AppLayout title="Dashboard">
        {isLoading ? (
          <DashboardLoading />
        ) : (
          <>
            <div className="py-4">
              <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
              <p className="text-slate-600 mb-6">Welcome to your dashboard!</p>
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mb-2 space-y-1">
                  <div>
                    Renders: {metrics.renderCount} | Avg: {metrics.averageRenderTime.toFixed(2)}ms
                  </div>
                  {memoryInfo && (
                    <div className={isHighUsage ? 'text-red-500' : ''}>
                      Memory: {memoryInfo.usedPercentage.toFixed(1)}% | 
                      Trend: {memoryInfo.trend} | 
                      Pressure: {pressureInfo.level}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* My Areas of Focus Card */}
            <AreasOfFocusCard />
          </>
        )}
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Dashboard;
