
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JoinRequestsManager } from "@/components/groups/JoinRequestsManager";
import { GroupAboutTab } from "@/components/groups/GroupAboutTab";
import { GroupSettingsTab } from "@/components/groups/GroupSettingsTab";
import { Settings } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "../posts/hooks/types/groupPostTypes";
import type { GroupMember } from "../members/types";

type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: GroupMember[];
  member_count: number;
};

interface MembershipStatus {
  isMember: boolean;
  isPending: boolean;
  isAdmin: boolean;
}

interface GroupDetailsTabsProps {
  group: Group | null;
  membershipStatus: MembershipStatus;
  user: Profile | null;
  hasPendingRequests: boolean;
  onJoinRequest: () => void;
  onMemberUpdate: () => void;
}

export const GroupDetailsTabs = ({
  group,
  membershipStatus,
  user,
  hasPendingRequests,
  onJoinRequest,
  onMemberUpdate,
}: GroupDetailsTabsProps) => {
  // Determine the default tab based on admin status and pending requests
  const getDefaultTab = () => {
    if (membershipStatus.isAdmin && hasPendingRequests) {
      return "requests";
    }
    return "about";
  };

  return (
    <Tabs defaultValue={getDefaultTab()} className="w-full">
      <TabsList className="mb-4">
        {membershipStatus.isAdmin && (
          <TabsTrigger value="requests">Requests</TabsTrigger>
        )}
        <TabsTrigger value="about">About</TabsTrigger>
        {membershipStatus.isAdmin && (
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        )}
      </TabsList>

      {membershipStatus.isAdmin && (
        <TabsContent value="requests">
          <JoinRequestsManager
            groupId={group?.id || ""}
            isAdmin={membershipStatus.isAdmin}
          />
        </TabsContent>
      )}

      <TabsContent value="about">
        <GroupAboutTab
          description={group?.description}
          user={user}
          membershipStatus={membershipStatus}
          onJoinRequest={onJoinRequest}
        />
      </TabsContent>

      {membershipStatus.isAdmin && (
        <TabsContent value="settings">
          <GroupSettingsTab
            group={group}
            onGroupUpdate={(updatedGroup) => onMemberUpdate()}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};
