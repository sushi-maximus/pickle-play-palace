
import { AppLayout } from "@/components/layout/AppLayout";
import { AreasOfFocusCard } from "@/components/dashboard/AreasOfFocusCard";

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard">
      <div className="py-6 md:py-12">
        <h1 className="text-3xl font-bold mb-4 hidden md:block">Dashboard</h1>
        <p className="text-slate-600 mb-6">Welcome to your dashboard!</p>
      </div>
      
      {/* My Areas of Focus Card */}
      <AreasOfFocusCard />
    </AppLayout>
  );
};

export default Dashboard;
