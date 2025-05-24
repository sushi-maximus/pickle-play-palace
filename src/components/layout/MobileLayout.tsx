
import { ReactNode } from "react";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { OptimizedBottomNavigation } from "@/components/navigation/OptimizedBottomNavigation";
import { MobileLayoutContent, MobileProfileSection } from "./components";
import { useMobileLayout } from "./hooks";
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
  const { topPadding, shouldShowProfileHeader } = useMobileLayout({
    showProfileHeader,
    profile
  });
  
  return (
    <>
      {/* Page Header - Fixed at top with z-60 */}
      <MobilePageHeader title={title} />
      
      {/* Profile Header - Only shown when specified and profile exists */}
      {profile && shouldShowProfileHeader && (
        <MobileProfileSection 
          profile={profile} 
          shouldShow={shouldShowProfileHeader} 
        />
      )}
      
      {/* Content Area with proper spacing */}
      <MobileLayoutContent topPadding={topPadding}>
        {children}
      </MobileLayoutContent>
      
      {/* Bottom Navigation - Fixed at bottom with z-100 */}
      <OptimizedBottomNavigation />
    </>
  );
};
