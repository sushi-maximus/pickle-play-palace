
import { ProfileContent } from "@/components/profile/ProfileContent";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileMobileLayout } from "@/components/profile/mobile/ProfileMobileLayout";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Profile = () => {
  const { user, profile, isLoading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleProfileUpdate = async () => {
    try {
      toast.success("Profile updated successfully!");
      await refreshProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      toast.success("Logged out successfully");
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  if (isLoading) {
    const LoadingLayout = isMobile ? ProfileMobileLayout : AppLayout;
    return (
      <RouteErrorBoundary routeName="Profile">
        <LoadingLayout title="Profile">
          <div>Loading...</div>
        </LoadingLayout>
      </RouteErrorBoundary>
    );
  }

  if (!user) {
    return null;
  }

  // Use ProfileMobileLayout for mobile, AppLayout for desktop
  if (isMobile) {
    return (
      <RouteErrorBoundary routeName="Profile">
        <ProfileMobileLayout title="Profile">
          <ProfileContent 
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            onLogout={handleLogout}
          />
        </ProfileMobileLayout>
      </RouteErrorBoundary>
    );
  }

  return (
    <RouteErrorBoundary routeName="Profile">
      <AppLayout title="Profile">
        <ProfileContent 
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
          onLogout={handleLogout}
        />
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Profile;
