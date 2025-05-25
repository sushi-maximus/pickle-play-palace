
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { GroupAboutTab } from "@/components/groups/GroupAboutTab";
import { GroupSettingsTab } from "@/components/groups/GroupSettingsTab";
import { JoinRequestsManager } from "@/components/groups/join-requests/JoinRequestsManager";
import { Settings, Users, UserPlus } from "lucide-react";
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
          <span>Members ({group?.member_count || 0})</span>
        </TabsTrigger>
        
        {membershipStatus.isAdmin && (
          <TabsTrigger value="requests" className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            <span>
              Requests
              {hasPendingRequests && (
                <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                  !
                </span>
              )}
            </span>
          </TabsTrigger>
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
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-lg font-medium">Group Members</h3>
          <div className="space-y-3 md:space-y-4">
            {(group?.members || [])
              .sort((a, b) => {
                // Admins first
                if (a.role === "admin" && b.role !== "admin") return -1;
                if (a.role !== "admin" && b.role === "admin") return 1;
                
                // Then by join date (newest first)
                return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime();
              })
              .map((member) => (
                <div key={member.id} className="bg-white shadow-sm rounded-lg px-3 py-4 md:px-6 md:py-8 hover:shadow-md transition-all duration-200">
                  {/* Member card content will be rendered here */}
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="h-8 w-8 md:h-10 md:w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm md:text-base">
                          {member.profiles.first_name} {member.profiles.last_name}
                        </span>
                        {member.role === "admin" && (
                          <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
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
