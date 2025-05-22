import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountInfo } from "@/components/profile/AccountInfo";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { user, signOut, profile } = useAuth();
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
    toast({
      title: "Success",
      description: "You have been logged out",
      variant: "default",
    });
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
          <div className="md:w-64 w-full">
            <ProfileSidebar onLogout={handleLogout} />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Profile Header with Avatar and Basic Info */}
            {user && profileData && (
              <ProfileHeader 
                user={user} 
                profile={profileData} 
                getInitials={getInitials} 
              />
            )}
            
            {/* Profile Tabs */}
            <Tabs defaultValue="personal-info" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal-info" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {user && profileData && (
                      <ProfileForm userId={user.id} profileData={profileData} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {user && profileData && (
                      <AccountInfo user={user} profile={profileData} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
