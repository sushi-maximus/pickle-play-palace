
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProfilePageLayout } from "@/components/profile/ProfilePageLayout";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileErrorState } from "@/components/profile/ProfileErrorState";

const Profile = () => {
  const { user, profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Profile page mounted - user:", user, "profile:", profile, "isLoading:", isLoading);
  }, [user, profile, isLoading]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    // This will trigger a re-render with the updated profile
    console.log("Profile updated:", updatedProfile);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <ProfilePageLayout>
        <ProfileSkeleton />
      </ProfilePageLayout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null;
  }

  // Show error if profile couldn't be loaded
  if (!profile) {
    return (
      <ProfilePageLayout>
        <ProfileErrorState />
      </ProfilePageLayout>
    );
  }

  console.log("Profile page rendering main content with profile:", profile);

  return (
    <ProfilePageLayout profile={profile}>
      <ProfileContent 
        profile={profile}
        onProfileUpdate={handleProfileUpdate}
        onLogout={handleLogout}
      />
    </ProfilePageLayout>
  );
};

export default Profile;
