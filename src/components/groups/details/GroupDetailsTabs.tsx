import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { JoinRequestsManager } from "@/components/groups/JoinRequestsManager";
import { GroupAboutTab } from "@/components/groups/GroupAboutTab";
import { GroupSettingsTab } from "@/components/groups/GroupSettingsTab";
import { Settings, Users } from "lucide-react";

interface GroupDetailsTabsProps {
  group: any;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
  user: any;
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
    return "members";
  };

  return (
    <Tabs defaultValue={getDefaultTab()} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="members" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>Members ({group?.member_count || 0})</span>
        </TabsTrigger>
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

      <TabsContent value="members">
        <h3 className="text-lg font-medium mb-4">Group Members</h3>
        <GroupMembersList
          members={group?.members || []}
          isAdmin={membershipStatus.isAdmin}
          currentUserId={user?.id || ""}
          groupId={group?.id}
          onMemberUpdate={onMemberUpdate}
        />
      </TabsContent>

      {membershipStatus.isAdmin && (
        <TabsContent value="requests">
          <JoinRequestsManager
            groupId={group?.id}
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
