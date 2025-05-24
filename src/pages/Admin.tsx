
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { PerformanceDashboard } from "@/components/performance";
import { usePerformanceMonitoring } from "@/hooks/performance";

const Admin = () => {
  // Integrated performance monitoring
  const { 
    metrics, 
    memoryInfo, 
    isHighUsage, 
    pressureInfo 
  } = usePerformanceMonitoring({}, {
    componentName: 'Admin',
    enabled: process.env.NODE_ENV === 'development',
    trackProps: true,
    renderThreshold: 10,
    memoryAlertThreshold: 75,
    logToConsole: true
  });

  return (
    <RouteErrorBoundary routeName="Admin">
      <AppLayout title="Admin">
        <div className="py-4">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-slate-600 mb-6">Administrative tools and performance monitoring</p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mb-6 p-3 bg-gray-50 rounded-lg space-y-1">
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
          
          {/* Performance Dashboard */}
          <PerformanceDashboard />
        </div>
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Admin;
