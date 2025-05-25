
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProgressionCard } from "@/components/profile/ProgressionCard";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileContentProps {
  profile: Profile;
  onProfileUpdate: () => void;
  onLogout: () => void;
}

export const ProfileContent = ({ profile, onProfileUpdate }: ProfileContentProps) => {
  const handleProfileUpdate = (updatedProfile: Profile) => {
    onProfileUpdate();
  };

  return (
    <div className="px-3 md:px-6 space-y-3">
      {/* Desktop Profile Header - Hidden on mobile, shown on desktop, no card wrapper */}
      <div className="hidden md:block mb-4 md:mb-6">
        <ProfileHeader profile={profile} />
      </div>
      
      {/* My Progression Card */}
      <ProgressionCard profile={profile} />
      
      {/* Profile Form Card */}
      <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
        <CardContent className="pt-6">
          <ProfileForm 
            profile={profile} 
            onProfileUpdate={handleProfileUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};
