
import { MobileProfileHeader } from "@/components/profile/MobileProfileHeader";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface MobileProfileSectionProps {
  profile: Profile;
}

export const MobileProfileSection = ({ profile }: MobileProfileSectionProps) => {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-slate-50 px-3 pt-2">
      <MobileProfileHeader profile={profile} />
    </div>
  );
};
