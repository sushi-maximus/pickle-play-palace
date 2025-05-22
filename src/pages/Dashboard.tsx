
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";

export default function Dashboard() {
  const { user, profile } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const greeting = getGreeting();
  const firstName = profile?.first_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 mx-auto py-8">
        <div className="border border-border rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{greeting}, {firstName}!</h2>
            <p className="text-muted-foreground">Welcome to your personal dashboard.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Your Skill Level</h3>
              <p className="text-2xl font-bold">{profile?.skill_level || "2.5"}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Status</h3>
              <p className="text-2xl font-bold">Active</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Profile Completion</h3>
              <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                <div className="bg-pickle-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm mt-1">75% complete</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-muted-foreground text-center py-8">No recent activity to show.</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <a href="/profile" className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 text-center transition-colors">
                <h4 className="font-medium">Edit Profile</h4>
                <p className="text-sm text-muted-foreground mt-1">Update your personal information</p>
              </a>
              <div className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 text-center transition-colors">
                <h4 className="font-medium">Find Games</h4>
                <p className="text-sm text-muted-foreground mt-1">Discover matches near you</p>
              </div>
              <div className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 text-center transition-colors">
                <h4 className="font-medium">Training Tips</h4>
                <p className="text-sm text-muted-foreground mt-1">Improve your skills</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
