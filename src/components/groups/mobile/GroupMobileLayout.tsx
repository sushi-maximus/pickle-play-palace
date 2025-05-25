
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
}

export const GroupMobileLayout = ({ 
  children, 
  groupName,
  groupCode,
  memberCount,
  activeTab,
  onTabChange,
  isAdmin = false
}: GroupMobileLayoutProps) => {
  return (
    <>
      {/* Group Header - Fixed at top with z-60 */}
      <MobileGroupHeader 
        groupName={groupName}
        groupCode={groupCode}
        memberCount={memberCount}
      />
      
      {/* Horizontal Group Tabs - Fixed below header */}
      <div className="fixed top-16 left-0 right-0 z-[80] bg-white shadow-sm">
        <GroupHorizontalTabs 
          activeTab={activeTab}
          onTabChange={onTabChange}
          isAdmin={isAdmin}
        />
      </div>
      
      {/* Content Area with proper spacing for header and horizontal tabs - removed horizontal padding */}
      <div className="flex-1 pt-28 pb-20">
        {children}
      </div>
      
      {/* Bottom Navigation - Fixed at bottom */}
      <OptimizedBottomNavigation />
    </>
  );
};
