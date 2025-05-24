
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupDetails } from "@/components/groups/details/hooks/useGroupDetails";
import { useGroupPosts } from "@/components/groups/posts/hooks/useGroupPosts";
import { useAutoRefresh } from "@/components/groups/posts/hooks/useAutoRefresh";
import { GroupDetailsLoading } from "@/components/groups/GroupDetailsLoading";
import { GroupDetailsTabs } from "@/components/groups/details/GroupDetailsTabs";
import { GroupMembersList } from "@/components/groups/members/GroupMembersList";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import {
  GroupMobileLayout,
  MobileHome2Tab,
} from "@/components/groups/mobile";
import { useEffect } from "react";
import { toast } from "sonner";

type ActiveTab = "home2" | "users" | "settings" | "calendar";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("home2");

  console.log("GroupDetails: Component rendering with ID:", id);

  // Early return and redirect if no ID
  useEffect(() => {
    if (!id || id.trim() === '') {
      console.error("GroupDetails: No group ID provided in URL parameters");
      toast.error("Invalid group URL - missing group ID");
      navigate("/groups", { replace: true });
      return;
    }
    console.log("GroupDetails: Valid group ID found:", id);
  }, [id, navigate]);

  // Group details and membership
  const {
    group,
    loading: groupLoading,
    error: groupError,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate
  } = useGroupDetails(id || "", user?.id);

  // Posts management
  const { 
    posts, 
    loading: postsLoading, 
    refreshing,
    error: postsError, 
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

  // Early return if no ID
  if (!id || id.trim() === '') {
    console.log("GroupDetails: Rendering loading state due to missing ID");
    return <GroupDetailsLoading />;
  }

  // Loading state
  if (groupLoading) {
    console.log("GroupDetails: Rendering loading state");
    return <GroupDetailsLoading />;
  }

  // Error state
  if (groupError) {
    console.error("GroupDetails: Rendering error state:", groupError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 p-6">
          <h2 className="text-xl font-medium text-gray-900">Error Loading Group</h2>
          <p className="text-gray-600">{groupError}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/groups")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Groups
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Group not found state
  if (!group) {
    console.log("GroupDetails: Group not found");
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 p-6">
          <h2 className="text-xl font-medium text-gray-900">Group Not Found</h2>
          <p className="text-gray-600">The group you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/groups")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  console.log("GroupDetails: Rendering group successfully:", group.name);

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
    <RouteErrorBoundary routeName="Group Details">
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
    </RouteErrorBoundary>
  );
};

export default GroupDetails;
