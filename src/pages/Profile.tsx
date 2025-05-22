
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Tables } from "@/integrations/supabase/types"; // Import Tables type from Supabase

const Profile = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get initials from first and last name
  const getInitials = () => {
    if (!profile) return "U";
    
    const firstInitial = profile.first_name ? profile.first_name.charAt(0) : "";
    const lastInitial = profile.last_name ? profile.last_name.charAt(0) : "";
    
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  // Define breadcrumb items for the profile page - removed Account from breadcrumb
  const breadcrumbItems = [{ label: "Profile" }];

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb navigation */}
          <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <ProfileSidebar onLogout={handleLogout} />
            </div>
            
            <div className="w-full md:w-3/4">
              <div className="space-y-8">
                {user && profile && (
                  <ProfileHeader 
                    user={user}
                    profile={profile as Tables<"profiles">}
                    getInitials={getInitials}
                  />
                )}
                {user && profile && (
                  <ProfileForm 
                    userId={user.id}
                    profileData={profile}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
