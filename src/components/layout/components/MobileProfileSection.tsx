
import { MobileProfileHeader } from "@/components/profile/MobileProfileHeader";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface MobileProfileSectionProps {
  profile: Profile;
}

export const MobileProfileSection = ({ profile }: MobileProfileSectionProps) => {
  return (
    <div className="px-3 pt-2">
      <MobileProfileHeader profile={profile} />
    </div>
  );
};
