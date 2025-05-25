import React from "react";
import { MobileGroupHeader } from "./MobileGroupHeader";
import { GroupHorizontalTabs } from "./GroupHorizontalTabs";

interface GroupMobileLayoutProps {
  groupName: string;
  memberCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
  hasPendingRequests?: boolean;
  children: React.ReactNode;
}

export const GroupMobileLayout = ({
  groupName,
  memberCount,
  activeTab,
  onTabChange,
  isAdmin,
  hasPendingRequests,
  children,
}: GroupMobileLayoutProps) => {
  console.log("GroupMobileLayout: Rendering with isAdmin:", isAdmin, "hasPendingRequests:", hasPendingRequests);
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobileGroupHeader groupName={groupName} memberCount={memberCount} />
      <GroupHorizontalTabs 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        isAdmin={isAdmin}
        hasPendingRequests={hasPendingRequests}
      />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
