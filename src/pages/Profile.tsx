
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
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
    <AppLayout 
      title="Profile" 
      showMobileProfileHeader={true}
      className="px-1 md:px-6 overflow-y-auto"
    >
      <ProfileContent 
        profile={profile}
        onProfileUpdate={handleProfileUpdate}
        onLogout={handleLogout}
      />
      
      {/* Logout Card - Always visible at the bottom with extra margin */}
      <div className="mt-8 mb-8">
        <LogoutCard onLogout={handleLogout} />
      </div>
    </AppLayout>
  );
};

export default Profile;
