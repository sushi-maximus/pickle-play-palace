
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { PerformanceDashboard } from "@/components/performance";

const Admin = () => {
  return (
    <RouteErrorBoundary routeName="Admin">
      <AppLayout title="Admin">
        <div className="py-4">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-slate-600 mb-6">Administrative tools and performance monitoring</p>
          
          {/* Performance Dashboard */}
          <PerformanceDashboard />
        </div>
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Admin;
