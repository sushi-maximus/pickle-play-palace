
import { Activity2Tab } from "@/components/groups/mobile/Activity2Tab";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { GroupDetailsTabs } from "./GroupDetailsTabs";
import { JoinRequestsManager } from "@/components/groups/JoinRequestsManager";
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
            onPostCreated={onPostCreated}
          />
        );
      
      case "users":
        return (
          <main className="flex-1 px-3 py-4">
            <div className="container mx-auto max-w-4xl">
              <div className="space-y-6">
                {/* Member Requests Section - Admin Only and only show if there are pending requests */}
                {membershipStatus.isAdmin && hasPendingRequests && (
                  <div>
                    <JoinRequestsManager
                      groupId={group?.id || ""}
                      isAdmin={membershipStatus.isAdmin}
                    />
                  </div>
                )}
                
                {/* Group Members Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Group Members</h3>
                  <GroupMembersList
                    members={group?.members || []}
                    isAdmin={membershipStatus.isAdmin}
                    currentUserId={user?.id || ""}
                    groupId={group?.id}
                    onMemberUpdate={onMemberUpdate}
                  />
                </div>
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
