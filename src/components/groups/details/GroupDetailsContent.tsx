
import { useState } from "react";
import { Activity2Tab, CalendarTab } from "@/components/groups/mobile";
import { GroupMembersList } from "@/components/groups/members";
import { GroupSettingsTab } from "@/components/groups/GroupSettingsTab";
import type { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'] & {
  member_count: number;
};

type Profile = Database['public']['Tables']['profiles']['Row'];

interface MembershipStatus {
  isMember: boolean;
  isAdmin: boolean;
  isPending: boolean;
}

interface GroupDetailsContentProps {
  activeTab: string;
  group: Group;
  user: Profile | null;
  membershipStatus: MembershipStatus;
  hasPendingRequests: boolean;
  groupId: string;
  onPostCreated: () => void;
  onMemberUpdate: () => void;
}

export const GroupDetailsContent = ({
  activeTab,
  group,
  user,
  membershipStatus,
  hasPendingRequests,
  groupId,
  onPostCreated,
  onMemberUpdate
}: GroupDetailsContentProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "activity2":
        return (
          <Activity2Tab
            groupId={groupId}
            user={user}
            isAdmin={membershipStatus.isAdmin}
            onPostCreated={onPostCreated}
          />
        );
      
      case "calendar":
        return (
          <CalendarTab
            isAdmin={membershipStatus.isAdmin}
          />
        );
      
      case "users":
        return (
          <GroupMembersList
            groupId={groupId}
            currentUserId={user?.id}
            isAdmin={membershipStatus.isAdmin}
            hasPendingRequests={hasPendingRequests}
            onMemberUpdate={onMemberUpdate}
          />
        );
      
      case "settings":
        return membershipStatus.isAdmin ? (
          <GroupSettingsTab
            group={group}
            onGroupUpdate={onMemberUpdate}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Only group administrators can access settings.</p>
          </div>
        );
      
      default:
        return (
          <Activity2Tab
            groupId={groupId}
            user={user}
            isAdmin={membershipStatus.isAdmin}
            onPostCreated={onPostCreated}
          />
        );
    }
  };

  return (
    <div className="flex-1">
      {renderTabContent()}
    </div>
  );
};
