
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountInfo } from "@/components/profile/AccountInfo";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { user, signOut, profile, isLoading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use profile data from AuthContext
  useEffect(() => {
    if (profile) {
      setProfileData(profile);
      // Add a small delay to make transitions smoother
      setTimeout(() => setIsLoading(false), 300);
    } else if (!authLoading) {
      // If auth loading is complete but no profile, stop loading state
      setIsLoading(false);
    }
  }, [profile, authLoading]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out", {
      description: "You have been logged out successfully",
      duration: 5000,
    });
  };

  const getInitials = () => {
    if (profileData?.first_name && profileData?.last_name) {
      return `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`.toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  // Show skeleton UI while data is loading
  const renderSkeletonContent = () => (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Sidebar Skeleton */}
      <div className="md:w-64 w-full">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4 py-2">
              <Skeleton className="h-8 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="flex-1 max-w-3xl">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-6 mb-8 p-6 bg-card rounded-lg shadow-sm border border-border">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="mt-4 md:mt-0 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex flex-wrap gap-4 mt-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Profile Tabs Skeleton */}
        <div className="mt-6">
          <div className="mb-6">
            <Skeleton className="h-10 w-[400px]" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 mx-auto py-8">
        {isLoading ? (
          renderSkeletonContent()
        ) : (
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
        )}
      </div>
    </div>
  );
}
