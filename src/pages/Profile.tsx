
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountInfo } from "@/components/profile/AccountInfo";

export default function Profile() {
  const { user, signOut, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // Use profile data from AuthContext
  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    await signOut();
    toast.success("You have been logged out");
  };

  const getInitials = () => {
    if (profileData?.first_name && profileData?.last_name) {
      return `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`.toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <ProfileSidebar onLogout={handleLogout} />
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="border border-border rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6">My Profile</h1>
              
              <div className="space-y-6">
                {/* Avatar Upload Section */}
                <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6 mb-8">
                  {user && profile && (
                    <ProfileAvatar 
                      userId={user.id}
                      avatarUrl={profile.avatar_url}
                      getInitials={getInitials}
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">
                      {profileData?.first_name} {profileData?.last_name}
                    </h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  {user && profileData && (
                    <ProfileForm userId={user.id} profileData={profileData} />
                  )}
                </div>
                
                {user && <AccountInfo user={user} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
