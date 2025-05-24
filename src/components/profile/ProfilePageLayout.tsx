
import { ReactNode } from "react";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";

interface ProfilePageLayoutProps {
  children: ReactNode;
}

export const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobilePageHeader title="Profile" />
      
      <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
        <div className="container mx-auto max-w-4xl space-y-3 md:space-y-4">
          {children}
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};
