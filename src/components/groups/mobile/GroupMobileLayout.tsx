
import { ReactNode } from "react";
import { MobileGroupHeader } from "./MobileGroupHeader";
import { GroupBottomNavigation } from "./GroupBottomNavigation";

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
      
      {/* Content Area with proper spacing for both context bar and header */}
      <div className="flex-1 pt-24 pb-20">
        {children}
      </div>
      
      {/* Group Bottom Navigation - Fixed at bottom with z-100 */}
      <GroupBottomNavigation 
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </>
  );
};
