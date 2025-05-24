
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

  console.log("GroupDetailsPage: Rendering with raw ID:", id, "User:", !!user);

  // Validate and clean the ID parameter - this must happen synchronously
  const cleanId = id?.trim();
  const isValidUUID = cleanId && cleanId !== ':id' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanId);
  
  // Only use the ID if it's valid, otherwise use null to prevent hook execution
  const validGroupId = isValidUUID ? cleanId : null;

  console.log("GroupDetailsPage: ID validation", {
    rawId: id,
    cleanId,
    isValidUUID,
    validGroupId
  });

  // Early return and redirect if no valid ID - this happens after render
  useEffect(() => {
    if (!cleanId || cleanId === '' || cleanId === ':id') {
      console.error("GroupDetailsPage: No valid group ID provided, ID:", id);
      toast.error("Invalid group URL - missing group ID");
      navigate("/groups", { replace: true });
      return;
    }
    
    if (!isValidUUID) {
      console.error("GroupDetailsPage: Invalid UUID format:", cleanId);
      toast.error("Invalid group ID format");
      navigate("/groups", { replace: true });
      return;
    }
    
    console.log("GroupDetailsPage: Valid group ID found:", cleanId);
  }, [cleanId, isValidUUID, navigate, id]);

  // Now we can safely call hooks - they will only execute with valid IDs
  const {
    group,
    loading: groupLoading,
    error: groupError,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate
  } = useGroupDetails(validGroupId || "", user?.id);

  // Posts management - only execute if we have a valid group ID
  const { 
    posts, 
    loading: postsLoading, 
    refreshing,
    error: postsError, 
    refreshPosts 
  } = useGroupPosts({ 
    groupId: validGroupId || "", 
    userId: user?.id 
  });

  // Auto refresh functionality
  const { handleManualRefresh } = useAutoRefresh({
    refreshFunction: refreshPosts,
    loading: postsLoading
  });

  // Event handlers
  const handlePostCreated = () => {
    console.log("GroupDetailsPage: Post created, refreshing posts");
    refreshPosts();
  };

  console.log("GroupDetailsPage: State check", {
    validGroupId,
    isValidUUID,
    groupLoading,
    groupError,
    group: !!group,
    user: !!user
  });

  // Early return if no valid ID - show loading while we redirect
  if (!validGroupId) {
    console.log("GroupDetailsPage: Rendering loading state due to invalid ID, will redirect");
    return <GroupDetailsLoading />;
  }

  // Loading state
  if (groupLoading) {
    console.log("GroupDetailsPage: Rendering loading state");
    return <GroupDetailsLoading />;
  }

  // Error state
  if (groupError) {
    console.log("GroupDetailsPage: Rendering error state due to error:", groupError);
    return <GroupDetailsErrorStates error={groupError} group={group} />;
  }

  // Group not found state
  if (!group) {
    console.log("GroupDetailsPage: Rendering error state due to missing group");
    return <GroupDetailsErrorStates error={null} group={null} />;
  }

  // Success state - render the group content
  console.log("GroupDetailsPage: Rendering group successfully:", group?.name);

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
            groupId={validGroupId}
            onPostCreated={handlePostCreated}
            onMemberUpdate={handleMemberUpdate}
          />
        </GroupMobileLayout>
      </div>
    </RouteErrorBoundary>
  );
};
