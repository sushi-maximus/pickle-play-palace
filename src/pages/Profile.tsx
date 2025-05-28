
import { ProfileContent } from "@/components/profile/ProfileContent";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteErrorBoundary } from "@/components/error-boundaries";

const Profile = () => {
  return (
    <RouteErrorBoundary routeName="Profile">
      <AppLayout title="Profile">
        <ProfileContent />
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Profile;
