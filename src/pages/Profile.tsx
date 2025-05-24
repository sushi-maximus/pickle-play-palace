
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";
import { MobileProfileHeader } from "@/components/profile/MobileProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LogoutCard } from "@/components/profile/LogoutCard";

const Profile = () => {
  const { user, profile, isLoading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Profile page mounted - user:", user, "isLoading:", isLoading);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
  }, [user, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MobilePageHeader title="Profile" />
        <main className="flex-1 pt-20 pb-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <MobileGroupsBottomNav />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !profile) {
    return null;
  }

  console.log("Profile page rendering main content");

  const handleProfileUpdate = async () => {
    await refreshProfile();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobilePageHeader title="Profile" />
      
      {/* Mobile Profile Header - Only shown on mobile */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-slate-50 px-3 pt-2">
        <MobileProfileHeader profile={profile} />
      </div>
      
      <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-48 md:pt-20">
        {/* Container for all cards with explicit bottom spacing */}
        <div className="container mx-auto max-w-4xl pb-32">
          <div className="space-y-3 md:space-y-4">
            <ProfileContent 
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
              onLogout={handleLogout}
            />
            
            {/* Logout Card - Ensure it's always visible */}
            <div className="relative z-10">
              <LogoutCard onLogout={handleLogout} />
            </div>
            
            {/* Extra spacing to ensure content is above bottom nav */}
            <div className="h-20 md:h-0" />
          </div>
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Profile;
