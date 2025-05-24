
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
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
      <div className="min-h-screen bg-slate-50 flex flex-col">
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Desktop Navigation - Only shown when authenticated */}
      {user && (
        <div className="hidden md:block">
          <Navbar />
        </div>
      )}
      
      {/* Mobile Layout */}
      <MobileLayout 
        title={title} 
        showProfileHeader={showMobileProfileHeader}
        profile={profile}
      >
        <main className={`flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4 ${className}`}>
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-3 md:space-y-4">
              {children}
            </div>
          </div>
        </main>
      </MobileLayout>
    </div>
  );
};
