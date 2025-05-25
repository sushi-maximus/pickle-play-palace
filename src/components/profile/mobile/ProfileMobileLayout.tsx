
import { ReactNode } from "react";
import { ProfileMobileHeader } from "./ProfileMobileHeader";
import { OptimizedBottomNavigation } from "@/components/navigation/OptimizedBottomNavigation";
import { OptimizedScrollArea } from "@/components/ui/OptimizedScrollArea";

interface ProfileMobileLayoutProps {
  children: ReactNode;
  title?: string;
}

export const ProfileMobileLayout = ({ 
  children, 
  title = "Profile"
}: ProfileMobileLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Profile Header - Fixed at top with z-60 */}
      <ProfileMobileHeader title={title} />
      
      {/* Content Area with optimized scrolling and enhanced spacing */}
      <OptimizedScrollArea className="flex-1 pt-16 pb-20 px-3 md:px-6">
        <div className="animate-fade-in space-y-3 md:space-y-4 py-4 md:py-6">
          {children}
        </div>
      </OptimizedScrollArea>
      
      {/* Bottom Navigation - Fixed at bottom */}
      <OptimizedBottomNavigation />
    </div>
  );
};
