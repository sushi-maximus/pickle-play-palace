
import { ReactNode } from "react";
import { MobileGroupHeader } from "./MobileGroupHeader";
import { GroupHorizontalTabs } from "./GroupHorizontalTabs";

interface GroupMobileLayoutProps {
  children: ReactNode;
  groupName: string;
  groupCode?: string;
  memberCount?: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const GroupMobileLayout = ({ 
  children, 
  groupName,
  groupCode,
  memberCount,
  activeTab,
  onTabChange
}: GroupMobileLayoutProps) => {
  return (
    <>
      {/* Group Header with context indicator - Fixed at top with z-60/70 */}
      <MobileGroupHeader 
        groupName={groupName}
        groupCode={groupCode}
        memberCount={memberCount}
      />
      
      {/* Horizontal Group Tabs - Fixed below header with z-50 */}
      <div className="fixed top-20 left-0 right-0 z-50">
        <GroupHorizontalTabs 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
      
      {/* Content Area with proper spacing for header, context bar, and horizontal tabs */}
      <div className="flex-1 pt-32 pb-20">
        {children}
      </div>
    </>
  );
};
