
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { LogoutCard } from "@/components/profile/LogoutCard";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileContentProps {
  profile: Profile;
  onProfileUpdate: () => void;
  onLogout: () => void;
}

export const ProfileContent = ({ profile, onProfileUpdate, onLogout }: ProfileContentProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleProfileUpdate = (updatedProfile: Profile) => {
    onProfileUpdate();
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
    <>
      {/* Desktop Profile Header - Hidden on mobile, shown on desktop, no card wrapper */}
      <div className="hidden md:block mb-4 md:mb-6">
        <ProfileHeader profile={profile} />
      </div>
      
      {/* Profile Form Card */}
      <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
        <CardContent className="pt-6">
          <ProfileForm 
            profile={profile} 
            onProfileUpdate={handleProfileUpdate}
          />
        </CardContent>
      </Card>

      {/* Logout Card - At the bottom with extra margin for mobile nav */}
      <div className="mb-8 md:mb-4">
        <LogoutCard onLogout={handleLogout} />
      </div>
    </>
  );
};
