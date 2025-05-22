
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, ChevronRight, LayoutDashboard, Users } from "lucide-react";

const Dashboard = () => {
  const { user, profile } = useAuth();
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
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Games Played
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">12</div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">+3 from last week</div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Skill Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{profile?.dupr_rating || "N/A"}</div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">Level: {profile?.skill_level || "Beginner"}</div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Community Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">38</div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">+5 new this month</div>
              </CardContent>
            </Card>
          </div>

          {/* Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest pickleball matches and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Doubles Match at Central Park", "Skills Workshop", "Mixed Doubles Tournament"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{item}</div>
                        <div className="text-sm text-muted-foreground">{new Date(2025, 4, 20-i).toLocaleDateString()}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events you've registered for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Spring Tournament", "Weekly League Play", "Skills Assessment"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{item}</div>
                        <div className="text-sm text-muted-foreground">{new Date(2025, 5, 5+i).toLocaleDateString()}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
