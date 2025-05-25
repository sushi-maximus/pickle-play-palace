
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MobileLayout } from "./MobileLayout";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showMobileProfileHeader?: boolean;
  className?: string;
}

export const AppLayout = ({ 
  children, 
  title,
  showMobileProfileHeader = false,
  className = ""
}: AppLayoutProps) => {
  const { user, profile, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col w-full">
        <MobileLayout title={title || "Loading"}>
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </main>
        </MobileLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full">
      <MobileLayout 
        title={title} 
        showProfileHeader={showMobileProfileHeader}
        profile={profile}
      >
        <main className={`flex-1 w-full ${className}`}>
          {children}
        </main>
      </MobileLayout>
    </div>
  );
};
