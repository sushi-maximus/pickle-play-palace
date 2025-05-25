
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { GroupAboutTab } from "@/components/groups/GroupAboutTab";
import { GroupSettingsTab } from "@/components/groups/GroupSettingsTab";
import { JoinRequestsManager } from "@/components/groups/join-requests/JoinRequestsManager";
import { Settings, Users, UserPlus, Info } from "lucide-react";
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
  console.log("GroupDetailsTabs: Debug info", {
    isAdmin: membershipStatus.isAdmin,
    isMember: membershipStatus.isMember,
    isPending: membershipStatus.isPending,
    userId: user?.id,
    groupId: group?.id,
    hasPendingRequests,
    membershipStatus: JSON.stringify(membershipStatus)
  });

  // Force show requests tab for debugging - we'll see if this makes it appear
  const shouldShowRequestsTab = membershipStatus.isAdmin;
  const shouldShowSettingsTab = membershipStatus.isAdmin;
  
  console.log("GroupDetailsTabs: Should show tabs", {
    shouldShowRequestsTab,
    shouldShowSettingsTab
  });

  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="mb-4 w-full grid grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="members" className="flex items-center gap-1">
          <Users className="h-3 w-3 md:h-4 md:w-4" />
          <span className="text-xs md:text-sm">
            Members ({group?.member_count || 0})
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="requests" className="flex items-center gap-1">
          <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
          <span className="flex items-center gap-1 text-xs md:text-sm">
            Requests
            {hasPendingRequests && (
              <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-medium">
                !
              </span>
            )}
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="about" className="flex items-center gap-1">
          <Info className="h-3 w-3 md:h-4 md:w-4" />
          <span className="text-xs md:text-sm">About</span>
        </TabsTrigger>
        
        {shouldShowSettingsTab && (
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm">Settings</span>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="members">
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-lg font-medium">Group Members</h3>
          <GroupMembersList
            members={group?.members || []}
            isAdmin={membershipStatus.isAdmin}
            currentUserId={user?.id}
            groupId={group?.id || ""}
            onMemberUpdate={onMemberUpdate}
          />
        </div>
      </TabsContent>

      <TabsContent value="requests">
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-lg font-medium">Join Requests</h3>
          {shouldShowRequestsTab ? (
            <JoinRequestsManager
              groupId={group?.id || ""}
              isAdmin={membershipStatus.isAdmin}
            />
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                Only group administrators can view join requests.
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="about">
        <GroupAboutTab
          description={group?.description}
          user={user}
          membershipStatus={membershipStatus}
          onJoinRequest={onJoinRequest}
        />
      </TabsContent>

      {shouldShowSettingsTab && (
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
