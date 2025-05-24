
import { MobileHome2Tab } from "@/components/groups/mobile";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { GroupDetailsTabs } from "./GroupDetailsTabs";
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: any[];
};

interface MembershipStatus {
  isMember: boolean;
  isPending: boolean;
  isAdmin: boolean;
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
      case "home2":
        return (
          <MobileHome2Tab
            groupId={groupId}
            user={user}
            onPostCreated={onPostCreated}
          />
        );
      
      case "users":
        return (
          <main className="flex-1 px-3 py-4">
            <div className="container mx-auto max-w-4xl">
              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-4">Group Members</h3>
                <GroupMembersList
                  members={group?.members || []}
                  isAdmin={membershipStatus.isAdmin}
                  currentUserId={user?.id || ""}
                  groupId={group?.id}
                  onMemberUpdate={onMemberUpdate}
                />
              </div>
            </div>
          </main>
        );
      
      case "settings":
        return (
          <main className="flex-1 px-3 py-4">
            <div className="container mx-auto max-w-4xl">
              <div className="space-y-3">
                <GroupDetailsTabs
                  group={group}
                  membershipStatus={membershipStatus}
                  user={user}
                  hasPendingRequests={hasPendingRequests}
                  onJoinRequest={() => {}}
                  onMemberUpdate={onMemberUpdate}
                />
              </div>
            </div>
          </main>
        );
      
      default:
        return (
          <main className="flex-1 px-3 py-4">
            <div className="container mx-auto max-w-4xl">
              <div className="space-y-3">
                <p className="text-center text-slate-500">Coming soon...</p>
              </div>
            </div>
          </main>
        );
    }
  };

  return renderTabContent();
};
