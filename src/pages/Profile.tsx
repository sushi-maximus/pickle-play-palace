
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
    console.log("Profile page mounted - user:", !!user, "profile:", !!profile, "isLoading:", isLoading);
  }, [user, profile, isLoading]);

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!isLoading && !user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
      return;
    }
  }, [user, isLoading, navigate]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    console.log("Still loading authentication state");
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

  // If user exists but profile is still loading, show loading
  if (user && !profile) {
    console.log("User exists but profile not loaded yet");
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
    return null;
  }

  // If we have user but no profile, there might be an issue
  if (!profile) {
    console.error("User exists but no profile found");
    return (
      <RouteErrorBoundary routeName="Profile">
        <AppLayout 
          title="Profile" 
          showMobileProfileHeader={false}
        >
          <div className="text-center py-8">
            <p className="text-red-600">Error loading profile. Please try refreshing the page.</p>
          </div>
        </AppLayout>
      </RouteErrorBoundary>
    );
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
    <RouteErrorBoundary routeName="Profile">
      <AppLayout 
        title="Profile" 
        showMobileProfileHeader={true}
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
    </RouteErrorBoundary>
  );
};

export default Profile;
