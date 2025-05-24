
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { MobileProfileHeader } from "@/components/profile/MobileProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountSettingsCard } from "@/components/profile/settings/AccountSettingsCard";
import { PrivacySettingsCard } from "@/components/profile/settings/PrivacySettingsCard";
import { PreferencesCard } from "@/components/profile/settings/PreferencesCard";
import { LogoutCard } from "@/components/profile/LogoutCard";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileContentProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
  onLogout: () => void;
}

export const ProfileContent = ({ profile, onProfileUpdate, onLogout }: ProfileContentProps) => {
  return (
    <>
      {/* Mobile Profile Header - Only shown on mobile */}
      <MobileProfileHeader profile={profile} />
      
      {/* Desktop Profile Header - Hidden on mobile, shown on desktop, no card wrapper */}
      <div className="hidden md:block mb-4 md:mb-6">
        <ProfileHeader profile={profile} />
      </div>
      
      {/* Profile Form Card */}
      <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
        <CardContent className="pt-6">
          <ProfileForm 
            profile={profile} 
            onProfileUpdate={onProfileUpdate}
          />
        </CardContent>
      </Card>

      {/* Settings Cards */}
      <AccountSettingsCard />
      <PrivacySettingsCard />
      <PreferencesCard />

      {/* Logout Card */}
      <LogoutCard onLogout={onLogout} />
    </>
  );
};
