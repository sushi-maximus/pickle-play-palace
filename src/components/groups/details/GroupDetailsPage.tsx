
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GroupDetailsContainer } from "./GroupDetailsContainer";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteErrorBoundary } from "@/components/error-boundaries";

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

  return (
    <RouteErrorBoundary routeName="GroupDetails">
      <AppLayout 
        title="Group Details" 
        fullWidth={true}
      >
        <GroupDetailsContainer groupId={id} user={user} />
      </AppLayout>
    </RouteErrorBoundary>
  );
};
