
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GroupDetailsContainer } from "./GroupDetailsContainer";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

export const GroupDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  if (!id) {
    return (
      <RouteErrorBoundary routeName="GroupDetails">
        <AppLayout title="Group Details">
          <div className="p-6 text-center">
            <p className="text-red-600">Invalid group ID</p>
          </div>
        </AppLayout>
      </RouteErrorBoundary>
    );
  }

  // Convert auth user to profile format
  const userProfile: Profile | null = user ? {
    id: user.id,
    first_name: user.user_metadata?.first_name || '',
    last_name: user.user_metadata?.last_name || '',
    avatar_url: user.user_metadata?.avatar_url || null,
    birthday: user.user_metadata?.birthday || '',
    created_at: user.created_at || new Date().toISOString(),
    dupr_profile_link: user.user_metadata?.dupr_profile_link || '',
    dupr_rating: user.user_metadata?.dupr_rating || 0,
    gender: user.user_metadata?.gender || 'Male',
    phone_number: user.user_metadata?.phone_number || '',
    skill_level: user.user_metadata?.skill_level || '',
    updated_at: user.updated_at || new Date().toISOString()
  } : null;

  return (
    <RouteErrorBoundary routeName="GroupDetails">
      <AppLayout 
        title="Group Details" 
        fullWidth={true}
      >
        <GroupDetailsContainer groupId={id} user={userProfile} />
      </AppLayout>
    </RouteErrorBoundary>
  );
};
