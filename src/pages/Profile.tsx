import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
  }, [user, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MobilePageHeader title="Profile" />
        <main className="flex-1 pt-20 pb-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <MobileGroupsBottomNav />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobilePageHeader title="Profile" />
      
      <main className="flex-1 pt-20 pb-24">
        <div className="px-3 py-4 md:px-6 md:py-8">
          <div className="container mx-auto max-w-4xl space-y-3 md:space-y-4">
            {/* Profile content will go here */}
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Page</h2>
              <p className="text-gray-600">Profile components will be added here</p>
            </div>
          </div>
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Profile;
