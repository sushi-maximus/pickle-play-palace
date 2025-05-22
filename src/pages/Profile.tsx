
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

const Profile = () => {
  const { user, supabase, signout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Define breadcrumb items for the profile page
  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Profile" }];

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
                <ProfileHeader />
                <ProfileForm />
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
