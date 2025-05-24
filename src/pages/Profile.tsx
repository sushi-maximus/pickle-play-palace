
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";
import { MobileProfileHeader } from "@/components/profile/MobileProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";

const Profile = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Profile page mounted - user:", user, "profile:", profile, "isLoading:", isLoading);
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

  const handleProfileUpdate = (updatedProfile: any) => {
    // Handle profile updates if needed
    console.log("Profile updated:", updatedProfile);
  };

  const handleLogout = async () => {
    // Handle logout if needed
    console.log("Logout requested");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobilePageHeader title="Profile" />
      
      <main className="flex-1 pt-20 pb-24">
        <div className="px-3 py-4 md:px-6 md:py-8">
          <div className="container mx-auto max-w-6xl">
            {/* Mobile Profile Header - Only shown on mobile */}
            <MobileProfileHeader profile={profile} />
            
            {/* Profile Content */}
            <ProfileContent 
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Profile;
