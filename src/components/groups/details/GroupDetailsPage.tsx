
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupDetails } from "./hooks/useGroupDetails";
import { useGroupPosts } from "@/components/groups/posts/hooks/useGroupPosts";
import { useAutoRefresh } from "@/components/groups/posts/hooks/useAutoRefresh";
import { useGroupDetailsState } from "./hooks/useGroupDetailsState";
import { GroupDetailsLoading } from "@/components/groups/GroupDetailsLoading";
import { GroupDetailsErrorStates } from "./GroupDetailsErrorStates";
import { GroupDetailsContent } from "./GroupDetailsContent";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { GroupMobileLayout } from "@/components/groups/mobile";
import { toast } from "sonner";

export const GroupDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeTab, handleTabChange } = useGroupDetailsState();

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

  // Error states
  const errorStateComponent = (
    <GroupDetailsErrorStates error={groupError} group={group} />
  );
  
  if (errorStateComponent) {
    return errorStateComponent;
  }

  console.log("GroupDetails: Rendering group successfully:", group.name);

  return (
    <RouteErrorBoundary routeName="Group Details">
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <GroupMobileLayout
          groupName={group.name}
          memberCount={group.member_count}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          <GroupDetailsContent
            activeTab={activeTab}
            group={group}
            user={user}
            membershipStatus={membershipStatus}
            hasPendingRequests={hasPendingRequests}
            groupId={id}
            onPostCreated={handlePostCreated}
            onMemberUpdate={handleMemberUpdate}
          />
        </GroupMobileLayout>
      </div>
    </RouteErrorBoundary>
  );
};
