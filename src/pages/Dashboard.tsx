
import { AppLayout } from "@/components/layout/AppLayout";
import { AreasOfFocusCard } from "@/components/dashboard/AreasOfFocusCard";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLoading } from "@/components/loading/DashboardLoading";

const Dashboard = () => {
  const { isLoading } = useAuth();

  return (
    <RouteErrorBoundary routeName="Dashboard">
      <AppLayout title="Dashboard">
        {isLoading ? (
          <DashboardLoading />
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-slate-600">Welcome to your dashboard!</p>
            </div>
            
            <AreasOfFocusCard />
          </div>
        )}
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Dashboard;
