
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
  console.log("GroupDetailsTabs: Rendering with admin status:", membershipStatus.isAdmin, "Pending requests:", hasPendingRequests);

  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="members" className="flex items-center gap-1 flex-1">
          <Users className="h-4 w-4" />
          <span>Members ({group?.member_count || 0})</span>
        </TabsTrigger>
        
        {membershipStatus.isAdmin && (
          <TabsTrigger value="requests" className="flex items-center gap-1 flex-1">
            <UserPlus className="h-4 w-4" />
            <span className="flex items-center gap-1">
              Requests
              {hasPendingRequests && (
                <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-medium">
                  !
                </span>
              )}
            </span>
          </TabsTrigger>
        )}
        
        <TabsTrigger value="about" className="flex items-center gap-1 flex-1">
          <Info className="h-4 w-4" />
          <span>About</span>
        </TabsTrigger>
        
        {membershipStatus.isAdmin && (
          <TabsTrigger value="settings" className="flex items-center gap-1 flex-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
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

      {membershipStatus.isAdmin && (
        <TabsContent value="requests">
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg font-medium">Join Requests</h3>
            <JoinRequestsManager
              groupId={group?.id || ""}
              isAdmin={membershipStatus.isAdmin}
            />
          </div>
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
