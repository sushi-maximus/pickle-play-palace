
import { ReactNode } from "react";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileProfileHeader } from "@/components/profile/MobileProfileHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfilePageLayoutProps {
  children: ReactNode;
  profile?: Profile | null;
}

export const ProfilePageLayout = ({ children, profile }: ProfilePageLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobilePageHeader title="Profile" />
      
      {/* Mobile Profile Header - Only shown on mobile when profile is available */}
      {profile && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-slate-50 px-3 pt-2">
          <MobileProfileHeader profile={profile} />
        </div>
      )}
      
      <main className={`flex-1 px-3 py-4 md:px-6 md:py-8 ${profile ? 'pt-48' : 'pt-16'} md:pt-4 pb-20 md:pb-4`}>
        <div className="container mx-auto max-w-4xl space-y-3 md:space-y-4">
          {children}
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};
