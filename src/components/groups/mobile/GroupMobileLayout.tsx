
import { ReactNode, useEffect, useRef } from "react";
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
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      console.log("Actual header height:", headerHeight);
    }
  }, []);

  return (
    <>
      {/* Group Header - Fixed at top with z-60 */}
      <div ref={headerRef}>
        <MobileGroupHeader 
          groupName={groupName}
          groupCode={groupCode}
        />
      </div>
      
      {/* Horizontal Group Tabs - Fixed directly below header with no gap */}
      <div className="fixed top-[72px] left-0 right-0 z-[80] bg-white shadow-sm">
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
