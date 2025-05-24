
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupDetails } from "@/components/groups/details/hooks/useGroupDetails";
import { useGroupPosts } from "@/components/groups/posts/hooks/useGroupPosts";
import { useAutoRefresh } from "@/components/groups/posts/hooks/useAutoRefresh";
import { GroupDetailsLoading } from "@/components/groups/GroupDetailsLoading";
import { GroupDetailsTabs } from "@/components/groups/details/GroupDetailsTabs";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import {
  GroupMobileLayout,
  MobileHome2Tab,
} from "@/components/groups/mobile";

type ActiveTab = "home2" | "users" | "settings" | "calendar";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("home2");

  // Group details and membership
  const {
    group,
    loading: groupLoading,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate
  } = useGroupDetails(id || "", user?.id);

  // Posts management
  const { 
    posts, 
    loading: postsLoading, 
    refreshing,
    error, 
    refreshPosts 
  } = useGroupPosts({ 
    groupId: id || "", 
    userId: user?.id 
  });

  // Auto refresh functionality
  const { handleManualRefresh } = useAutoRefresh({
    refreshFunction: refreshPosts,
    loading: postsLoading
  });

  // Event handlers
  const handlePostCreated = () => {
    refreshPosts();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ActiveTab);
  };

  // Loading and error states
  if (!id || groupLoading) {
    return <GroupDetailsLoading />;
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Group not found</p>
      </div>
    );
  }

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "home2":
        return (
          <MobileHome2Tab
            groupId={id}
            user={user}
            onPostCreated={handlePostCreated}
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
                  onMemberUpdate={handleMemberUpdate}
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
                  onMemberUpdate={handleMemberUpdate}
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <GroupMobileLayout
        groupName={group.name}
        groupCode={group.code || undefined}
        memberCount={group.member_count}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        {renderTabContent()}
      </GroupMobileLayout>
    </div>
  );
};

export default GroupDetails;
