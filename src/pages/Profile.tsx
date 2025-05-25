
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProfileMobileLayout } from "@/components/profile/mobile/ProfileMobileLayout";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LogoutCard } from "@/components/profile/LogoutCard";
import { MobileProfileHeader } from "@/components/profile/MobileProfileHeader";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { ProfileSkeleton } from "@/components/loading/ProfileSkeleton";
import { toast } from "@/components/ui/sonner";

const Profile = () => {
  const { user, profile, isLoading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📱 Profile page mounted - user:", !!user, "profile:", !!profile, "isLoading:", isLoading);
  }, [user, profile, isLoading]);

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("⚠️ Profile page still loading after 10 seconds - this might indicate an issue");
        toast.error("Profile is taking longer than expected to load");
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!isLoading && !user) {
      console.log("🔀 No user found, redirecting to login");
      navigate("/login");
      return;
    }
  }, [user, isLoading, navigate]);

  // Show enhanced loading state while authentication is being checked
  if (isLoading) {
    console.log("⏳ Still loading authentication state");
    return (
      <RouteErrorBoundary routeName="Profile">
        <ProfileMobileLayout title="Profile">
          <div className="animate-fade-in">
            <ProfileSkeleton />
          </div>
        </ProfileMobileLayout>
      </RouteErrorBoundary>
    );
  }

  // If no user after loading is complete, this will be handled by the useEffect redirect
  if (!user) {
    console.log("🚫 No user after loading complete");
    return null;
  }

  console.log("🎯 Profile page rendering main content - user exists, profile:", !!profile);

  const handleProfileUpdate = async () => {
    try {
      console.log("🔄 Handling profile update");
      toast.success("Profile updated successfully!");
      await refreshProfile();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 Handling logout");
      toast.success("Logged out successfully");
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("❌ Error during logout:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <RouteErrorBoundary routeName="Profile">
      <ProfileMobileLayout title="Profile">
        <div className="animate-fade-in">
          {profile ? (
            <>
              {/* Mobile Profile Header - Shows the profile card with animations */}
              <MobileProfileHeader profile={profile} />
              
              <ProfileContent 
                profile={profile}
                onProfileUpdate={handleProfileUpdate}
                onLogout={handleLogout}
              />
              
              {/* Logout Card - Always visible at the bottom with extra margin and hover effects */}
              <div className="mt-8 mb-8 animate-slide-in">
                <LogoutCard onLogout={handleLogout} />
              </div>
            </>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <p className="text-gray-600 mb-4">
                No profile found. This is normal for new accounts.
              </p>
              <p className="text-sm text-gray-500">
                You can still access your account settings below.
              </p>
              <div className="mt-8 mb-8 animate-slide-in">
                <LogoutCard onLogout={handleLogout} />
              </div>
            </div>
          )}
        </div>
      </ProfileMobileLayout>
    </RouteErrorBoundary>
  );
};

export default Profile;
