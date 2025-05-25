
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
import { RouteErrorBoundary } from "@/components/error-boundaries/RouteErrorBoundary";
import { GroupMobileLayout } from "@/components/groups/mobile";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const GroupDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeTab, handleTabChange } = useGroupDetailsState();

  console.log("GroupDetailsPage: Rendering with raw ID:", id, "User:", !!user);

  // Validate and clean the ID parameter
  const cleanId = id?.trim();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValidUUID = cleanId && cleanId !== ':id' && uuidRegex.test(cleanId);
  
  // CRITICAL FIX: Always use the same groupId for hooks to prevent hook order changes
  const safeGroupId = isValidUUID ? cleanId! : "";

  console.log("GroupDetailsPage: ID validation", {
    rawId: id,
    cleanId,
    isValidUUID,
    safeGroupId
  });

  // Convert Supabase Auth User to Profile for component compatibility
  const userProfile: Profile | null = user ? {
    id: user.id,
    first_name: user.user_metadata?.first_name || '',
    last_name: user.user_metadata?.last_name || '',
    avatar_url: user.user_metadata?.avatar_url || null,
    birthday: user.user_metadata?.birthday || null,
    created_at: user.created_at || new Date().toISOString(),
    updated_at: user.updated_at || new Date().toISOString(),
    dupr_profile_link: user.user_metadata?.dupr_profile_link || null,
    dupr_rating: user.user_metadata?.dupr_rating || null,
    gender: user.user_metadata?.gender || 'Male',
    phone_number: user.user_metadata?.phone_number || null,
    skill_level: user.user_metadata?.skill_level || '2.5'
  } : null;

  // CRITICAL FIX: Always call hooks in the same order, regardless of validation
  // This prevents the "rendered more hooks" error
  const {
    group,
    loading: groupLoading,
    error: groupError,
    membershipStatus,
    hasPendingRequests,
    handleMemberUpdate
  } = useGroupDetails(safeGroupId, user?.id);

  const { 
    posts, 
    loading: postsLoading, 
    refreshing,
    error: postsError, 
    refreshPosts 
  } = useGroupPosts({ 
    groupId: safeGroupId, 
    userId: user?.id 
  });

  // Auto refresh functionality
  const { handleManualRefresh } = useAutoRefresh({
    refreshFunction: refreshPosts,
    loading: postsLoading
  });

  // Handle invalid IDs with redirect - moved after all hooks
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

  // Event handlers
  const handlePostCreated = () => {
    console.log("GroupDetailsPage: Post created, refreshing posts");
    refreshPosts();
  };

  console.log("GroupDetailsPage: State check", {
    safeGroupId,
    isValidUUID,
    groupLoading,
    groupError,
    group: !!group,
    user: !!user,
    isAdmin: membershipStatus.isAdmin
  });

  // Early return if no valid ID - show loading while we redirect
  if (!isValidUUID) {
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
  console.log("GroupDetailsPage: Rendering group successfully:", group?.name, "Admin status:", membershipStatus.isAdmin);

  return (
    <RouteErrorBoundary routeName="Group Details">
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <GroupMobileLayout
          groupName={group.name}
          memberCount={group.member_count}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isAdmin={membershipStatus.isAdmin}
        >
          <GroupDetailsContent
            activeTab={activeTab}
            group={group}
            user={userProfile}
            membershipStatus={membershipStatus}
            hasPendingRequests={hasPendingRequests}
            groupId={safeGroupId}
            onPostCreated={handlePostCreated}
            onMemberUpdate={handleMemberUpdate}
          />
        </GroupMobileLayout>
      </div>
    </RouteErrorBoundary>
  );
};

export default GroupDetailsPage;
export { GroupDetailsPage };
