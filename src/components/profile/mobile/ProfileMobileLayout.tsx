
import { ReactNode } from "react";
import { ProfileMobileHeader } from "./ProfileMobileHeader";
import { OptimizedBottomNavigation } from "@/components/navigation/OptimizedBottomNavigation";

interface ProfileMobileLayoutProps {
  children: ReactNode;
  title?: string;
}

export const ProfileMobileLayout = ({ 
  children, 
  title = "Profile"
}: ProfileMobileLayoutProps) => {
  return (
    <>
      {/* Profile Header - Fixed at top with z-60 */}
      <ProfileMobileHeader title={title} />
      
      {/* Content Area with proper spacing for header - with horizontal padding */}
      <div className="flex-1 pt-16 pb-20 px-3">
        {children}
      </div>
      
      {/* Bottom Navigation - Fixed at bottom */}
      <OptimizedBottomNavigation />
    </>
  );
};
