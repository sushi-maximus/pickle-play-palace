
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LogoutCard } from "@/components/profile/LogoutCard";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { ProfileLoading } from "@/components/loading/ProfileLoading";

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

  // Show loading state while authentication is being checked
  if (isLoading) {
    console.log("⏳ Still loading authentication state");
    return (
      <RouteErrorBoundary routeName="Profile">
        <AppLayout 
          title="Profile" 
          showMobileProfileHeader={false}
        >
          <ProfileLoading />
        </AppLayout>
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
      await refreshProfile();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 Handling logout");
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  };

  return (
    <RouteErrorBoundary routeName="Profile">
      <AppLayout 
        title="Profile" 
        showMobileProfileHeader={true}
      >
        {profile ? (
          <>
            <ProfileContent 
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
              onLogout={handleLogout}
            />
            
            {/* Logout Card - Always visible at the bottom with extra margin */}
            <div className="mt-8 mb-8">
              <LogoutCard onLogout={handleLogout} />
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No profile found. This is normal for new accounts.
            </p>
            <p className="text-sm text-gray-500">
              You can still access your account settings below.
            </p>
            <div className="mt-8 mb-8">
              <LogoutCard onLogout={handleLogout} />
            </div>
          </div>
        )}
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Profile;
