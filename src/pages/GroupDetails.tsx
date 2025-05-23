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
  MobileGroupHeader,
  MobileIconMenu,
  MobileChatFeed,
  MobileComposeArea,
} from "@/components/groups/mobile";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");

  const {
    group,
    loading: groupLoading,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate
  } = useGroupDetails(id || "", user?.id);

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

  const { handleManualRefresh } = useAutoRefresh({
    refreshFunction: refreshPosts,
    loading: postsLoading
  });

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

  const handlePostCreated = () => {
    refreshPosts();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <MobileChatFeed
            posts={posts}
            loading={postsLoading}
            refreshing={refreshing}
            currentUserId={user?.id}
          />
        );
      
      case "users":
        return (
          <div className="flex-1 px-4 py-6">
            <h3 className="text-lg font-medium mb-4">Group Members</h3>
            <GroupMembersList
              members={group?.members || []}
              isAdmin={membershipStatus.isAdmin}
              currentUserId={user?.id || ""}
              groupId={group?.id}
              onMemberUpdate={handleMemberUpdate}
            />
          </div>
        );
      
      case "settings":
        return (
          <div className="flex-1 px-4 py-6">
            <GroupDetailsTabs
              group={group}
              membershipStatus={membershipStatus}
              user={user}
              hasPendingRequests={hasPendingRequests}
              onJoinRequest={() => {}}
              onMemberUpdate={handleMemberUpdate}
            />
          </div>
        );
      
      default:
        return (
          <div className="flex-1 px-4 py-6">
            <p className="text-center text-slate-500">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobileGroupHeader 
        groupName={group.name} 
        groupCode={group.code || undefined}
      />
      
      {membershipStatus.isMember && (
        <MobileComposeArea
          groupId={id}
          user={user}
          onPostCreated={handlePostCreated}
        />
      )}
      
      <div className="flex-1 mt-16 pt-20 pb-20 overflow-hidden">
        {renderContent()}
      </div>
      
      <MobileIconMenu 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default GroupDetails;
