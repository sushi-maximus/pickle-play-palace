
import { Navbar } from "@/components/Navbar";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Header */}
      <MobilePageHeader title="Dashboard" />
      
      <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4 hidden md:block">Dashboard</h1>
            <p className="text-slate-600">Welcome to your dashboard. Content coming soon!</p>
          </div>
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Dashboard;
