
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupAboutTab } from "@/components/groups/GroupAboutTab";
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
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>

      <TabsContent value="about">
        <GroupAboutTab
          description={group?.description}
          user={user}
          membershipStatus={membershipStatus}
          onJoinRequest={onJoinRequest}
        />
      </TabsContent>
    </Tabs>
  );
};
