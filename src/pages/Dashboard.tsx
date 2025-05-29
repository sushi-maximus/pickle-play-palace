
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton";

const Dashboard = () => {
  const { isLoading, user } = useAuth();

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

  // Empty dashboard content
  return (
    <RouteErrorBoundary routeName="Dashboard">
      <AppLayout title="Dashboard">
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-slate-600">Welcome to your dashboard!</p>
          </div>
        </div>
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Dashboard;
