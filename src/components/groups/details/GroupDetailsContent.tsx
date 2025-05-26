
import { Activity2Tab } from "@/components/groups/mobile/Activity2Tab";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { GroupDetailsTabs } from "./GroupDetailsTabs";
import { JoinRequestsManager } from "@/components/groups/JoinRequestsManager";
import { GroupSettingsTab } from "@/components/groups/GroupSettingsTab";
import { Badge } from "@/components/ui/badge";
import { FacebookErrorBoundary } from "@/components/groups/mobile/FacebookErrorBoundary";
import { FacebookErrorFallback } from "@/components/groups/mobile/FacebookErrorFallback";
import { FacebookLoadingState } from "@/components/groups/mobile/FacebookLoadingState";
import { FacebookNetworkStatus } from "@/components/groups/mobile/FacebookNetworkStatus";
import { useOptimizedPullToRefresh } from "@/hooks/useOptimizedPullToRefresh";
import { useCallback } from "react";
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
  const handleRefreshMembers = useCallback(async () => {
    // Trigger member data refresh
    onMemberUpdate();
  }, [onMemberUpdate]);

  const { pullDistance, isRefreshing, isPulling, bindToElement, shouldTrigger } = useOptimizedPullToRefresh({
    onRefresh: handleRefreshMembers,
    threshold: 80,
    disabled: activeTab !== "users"
  });

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
          <FacebookErrorBoundary
            fallback={({ error, resetError }) => (
              <FacebookErrorFallback
                error={error}
                resetError={resetError}
                title="Members Error"
                description="There was a problem loading the group members. This might be a temporary issue."
              />
            )}
          >
            {/* Main Container - Following Activity page design */}
            <main className="flex-1 bg-gray-50 overflow-hidden min-h-0">
              {/* Network Status Indicator */}
              <FacebookNetworkStatus />
              
              <div className="max-w-2xl mx-auto h-full flex flex-col">
                {/* Pull to Refresh Indicator - Sticky positioned */}
                {(isPulling || isRefreshing) && (
                  <div 
                    className="flex-shrink-0 sticky top-0 z-20 flex items-center justify-center py-2 bg-blue-50 border-b border-blue-100 animate-fade-in"
                    style={{ 
                      transform: isPulling ? `translateY(${Math.min(pullDistance, 60)}px)` : 'none',
                      opacity: isPulling ? Math.min(pullDistance / 60, 1) : 1
                    }}
                  >
                    <div className={`text-blue-600 text-sm font-medium ${isRefreshing ? 'animate-pulse' : ''}`}>
                      {isRefreshing ? 'Refreshing members...' : shouldTrigger ? 'Release to refresh' : 'Pull to refresh'}
                    </div>
                  </div>
                )}

                {/* Members Header - Sticky with proper z-index and background */}
                <div className="flex-shrink-0 sticky top-0 z-10 bg-gray-50 pt-safe mb-4 animate-fade-in">
                  <div className="text-center py-4">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">Group Members</h3>
                    <div className="flex items-center justify-center">
                      <Badge variant="secondary" className="text-xs sm:text-sm font-medium px-2.5 py-1">
                        {group?.member_count || 0} {(group?.member_count || 0) === 1 ? 'member' : 'members'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Members Content Area - Enhanced scrolling with momentum and safe areas */}
                <div 
                  ref={bindToElement}
                  className="flex-1 overflow-y-auto overscroll-behavior-y-contain webkit-overflow-scrolling-touch min-h-0"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="p-3 sm:p-4 pb-4 sm:pb-6 pb-safe space-y-3 sm:space-y-4">
                    {/* Member Requests Section - Admin Only and only show if there are pending requests */}
                    {membershipStatus.isAdmin && hasPendingRequests && (
                      <div className="animate-fade-in">
                        <JoinRequestsManager
                          groupId={group?.id || ""}
                          isAdmin={membershipStatus.isAdmin}
                        />
                      </div>
                    )}
                    
                    {/* Group Members Section */}
                    <div className="space-y-3 sm:space-y-4 animate-fade-in">
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
              </div>
            </main>
          </FacebookErrorBoundary>
        );
      
      case "settings":
        return (
          <GroupSettingsTab
            group={group}
            onGroupUpdate={onMemberUpdate}
          />
        );
      
      default:
        return (
          <main className="flex-1 bg-gray-50 overflow-hidden min-h-0">
            <div className="max-w-2xl mx-auto h-full flex flex-col">
              <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain webkit-overflow-scrolling-touch min-h-0">
                <div className="p-3 sm:p-4 pb-safe">
                  <div className="space-y-3 sm:space-y-4 animate-fade-in">
                    <p className="text-center text-slate-500">Coming soon...</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        );
    }
  };

  return renderTabContent();
};
