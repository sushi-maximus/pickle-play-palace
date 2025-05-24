
import { ReactNode } from "react";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { MobileProfileHeader } from "@/components/profile/MobileProfileHeader";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showProfileHeader?: boolean;
  profile?: Profile | null;
}

export const MobileLayout = ({ 
  children, 
  title = "PicklePlay",
  showProfileHeader = false,
  profile 
}: MobileLayoutProps) => {
  // Calculate top padding based on whether profile header is shown
  const topPadding = showProfileHeader && profile ? 'pt-48' : 'pt-16';
  
  return (
    <>
      {/* Page Header - Fixed at top with z-60 */}
      <MobilePageHeader title={title} />
      
      {/* Profile Header - Only shown when specified and profile exists */}
      {showProfileHeader && profile && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-slate-50 px-3 pt-2">
          <MobileProfileHeader profile={profile} />
        </div>
      )}
      
      {/* Content Area with proper spacing */}
      <div className={`flex-1 ${topPadding} pb-20`}>
        {children}
      </div>
      
      {/* Bottom Navigation - Fixed at bottom with z-100 */}
      <BottomNavigation />
    </>
  );
};
