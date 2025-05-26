
import { ReactNode } from "react";
import { MobileGroupHeader } from "./MobileGroupHeader";
import { GroupHorizontalTabs } from "./GroupHorizontalTabs";
import { OptimizedBottomNavigation } from "@/components/navigation/OptimizedBottomNavigation";

interface GroupMobileLayoutProps {
  children: ReactNode;
  groupName: string;
  groupCode?: string;
  memberCount?: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
  hasPendingRequests?: boolean;
}

export const GroupMobileLayout = ({ 
  children, 
  groupName,
  groupCode,
  memberCount,
  activeTab,
  onTabChange,
  isAdmin = false,
  hasPendingRequests = false
}: GroupMobileLayoutProps) => {
  return (
    <>
      {/* Group Header - Fixed at top with z-60 */}
      <MobileGroupHeader 
        groupName={groupName}
        groupCode={groupCode}
      />
      
      {/* Horizontal Group Tabs - Fixed directly below header with no gap */}
      <div className="fixed top-[68px] left-0 right-0 z-[80] bg-white shadow-sm">
        <GroupHorizontalTabs 
          activeTab={activeTab}
          onTabChange={onTabChange}
          isAdmin={isAdmin}
          hasPendingRequests={hasPendingRequests}
          memberCount={memberCount}
        />
      </div>
      
      {/* Content Area with proper spacing for header and horizontal tabs */}
      <div className="flex-1 pt-32 pb-20 px-3">
        {children}
      </div>
      
      {/* Bottom Navigation - Fixed at bottom */}
      <OptimizedBottomNavigation />
    </>
  );
};
