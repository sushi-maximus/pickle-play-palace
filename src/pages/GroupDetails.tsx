
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupDetails } from "@/components/groups/details/hooks/useGroupDetails";
import { useGroupPosts } from "@/components/groups/posts/hooks/useGroupPosts";
import { useAutoRefresh } from "@/components/groups/posts/hooks/useAutoRefresh";
import { GroupDetailsLoading } from "@/components/groups/GroupDetailsLoading";
import { GroupDetailsTabs } from "@/components/groups/details/GroupDetailsTabs";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import {
  MobileGroupHeader,
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
          <div className="flex-1 px-4 py-6 relative z-0">
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
          <div className="flex-1 px-4 py-6 relative z-0">
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
          <div className="flex-1 px-4 py-6 relative z-0">
            <p className="text-center text-slate-500">Coming soon...</p>
          </div>
        );
    }
  };

  // Group-specific navigation items
  const groupNavigationItems = [
    { id: "home2", label: "Home" },
    { id: "calendar", label: "Calendar" },
    { id: "users", label: "Members" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobileGroupHeader 
        groupName={group.name} 
        groupCode={group.code || undefined}
        memberCount={group.member_count}
      />
      
      <div className="flex-1 mt-16 pb-20 overflow-hidden relative">
        {renderTabContent()}
      </div>
      
      {/* Group-specific bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] shadow-lg">
        <div className="flex justify-around items-center py-2">
          {groupNavigationItems.map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center gap-1 py-2 px-3 ${
                activeTab === item.id ? "text-primary" : "text-slate-600"
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
