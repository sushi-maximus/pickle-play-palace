
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Define breadcrumb items for the dashboard page
  const breadcrumbItems = [{ label: "Dashboard" }];

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb navigation */}
          <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
              <p className="text-muted-foreground">
                This is your pickleball activity hub. Your games, stats, and communities will appear here.
              </p>
            </Card>
            {/* Additional dashboard cards would go here */}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
