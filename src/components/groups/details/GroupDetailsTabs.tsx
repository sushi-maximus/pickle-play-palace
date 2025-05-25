
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { GroupAboutTab } from "@/components/groups/GroupAboutTab";
import { GroupSettingsTab } from "@/components/groups/GroupSettingsTab";
import { Settings, Users } from "lucide-react";
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
  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="members" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>
            Members ({group?.member_count || 0})
            {membershipStatus.isAdmin && hasPendingRequests && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                !
              </span>
            )}
          </span>
        </TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        {membershipStatus.isAdmin && (
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="members">
        <GroupMembersList
          members={group?.members || []}
          isAdmin={membershipStatus.isAdmin}
          currentUserId={user?.id || ""}
          groupId={group?.id || ""}
          onMemberUpdate={onMemberUpdate}
        />
      </TabsContent>

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
